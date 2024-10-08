from flask import Flask, request, jsonify, render_template, send_from_directory
from transformers import BertTokenizer
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from transformers import BertModel
from flask_cors import CORS

import pickle
import re
import os
import numpy as np
import torch
import torch.nn as nn

app = Flask(__name__)
CORS(app)

class BertForMachinery(nn.Module):
    def __init__(self, num_machinery_labels, extra_features_dim):
        super(BertForMachinery, self).__init__()
        self.bert = BertModel.from_pretrained('bert-base-uncased')
        self.fc1 = nn.Linear(773, 256)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)
        self.machinery_classifier = nn.Linear(256, num_machinery_labels)

    def forward(self, input_ids, attention_mask, extra_features):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = outputs.pooler_output
        
        if extra_features.dim() == 1:
            extra_features = extra_features.unsqueeze(1)
        
        machinery_combined_features = torch.cat((pooled_output, extra_features), dim=1)
        x = self.fc1(machinery_combined_features)
        x = self.relu(x)
        x = self.dropout(x)
        machinery_outputs = self.machinery_classifier(x)
        
        return machinery_outputs
    
current_dir = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(current_dir, 'models/0924_best_machinery_model.pkl'), 'rb') as f:
    machinery_optimized_model = pickle.load(f)

with open(os.path.join(current_dir, 'models/berttoxgboost_assembly_model.pkl'), 'rb') as f:
    assembly_optimized_model = pickle.load(f)

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

with open(os.path.join(current_dir, 'models/assembly_tokenizer.pkl'), 'rb') as f:
    assembly_tokenizer = pickle.load(f)

with open(os.path.join(current_dir, 'models/label_encoder_machinery.pkl'), 'rb') as f:
    label_encoder_machinery = pickle.load(f)

with open(os.path.join(current_dir, 'models/label_encoder_assembly.pkl'), 'rb') as f:
    label_encoder_assembly = pickle.load(f)

currency_ohe = OneHotEncoder(sparse_output=False)
currencies = [['USD'], ['KRW'], ['EUR'], ['JPY']]
currency_ohe.fit(currencies)

with open(os.path.join(current_dir, 'models/scaler.pkl'), 'rb') as f:
    scaler = pickle.load(f)

def preprocess_text(text):
    text = re.sub(r'\([^)]*\)', '', text)  
    text = re.sub(r'[^\w\s\*/\-\+.,#&]', '', text) 
    text = re.sub(r'\s+', '_', text)
    text = re.sub(r'_+', '_', text) 
    text = re.sub(r'\b(사용금지|사)\b', '', text, flags=re.IGNORECASE)
    text = re.sub(r'(?<!\w)_(?!\w)', '', text)
    text = re.sub(r'_([^\w]+)_', '_', text)
    text = re.sub(r'_([^\w]+)$', '', text)
    text = re.sub(r'^([^\w]+)_', '', text)
    text = re.sub(r'_+$', '', text)
    text = ' '.join([word.lower() if re.match(r'[A-Za-z]', word) else word for word in text.split()])
    text = text.strip()
    return text

def clean_supplier_name(name):
    suffixes = r'\b(Corp\.?|Corporation|Company|Co\.?|Incorporated|Inc\.?|Limited|Ltd\.?|GmbH|S\.L\.|SDN\. BHD\.)\b'
    name = re.sub(suffixes, '', name, flags=re.IGNORECASE)
    name = re.sub(r'[^\w\s]', '', name)
    name = re.sub(r'\b(사용금지|사)\b', '', name, flags=re.IGNORECASE)
    name = re.sub(r'\s+', ' ', name).strip()
    name = re.sub(r'coporation|coropration|coproration|corporration', 'corporation', name, flags=re.IGNORECASE)
    name = name.lower().strip()
    return name

# BERT 토크나이저(Machinery 모델용)
def encode_data_machinery(texts):
    return tokenizer(texts, padding=True, truncation=True, max_length=128, return_tensors='pt')


# 정수 시퀀스 토크나이저(Assembly 모델용)
def encode_data_assembly(texts, max_len=50):
    sequences = assembly_tokenizer.texts_to_sequences(texts) 
    return pad_sequences(sequences, maxlen=max_len)

def predict_machinery(model, texts, extra_features, device):
    try:
        model.eval()
        with torch.no_grad():
            inputs = encode_data_machinery(texts)
            extra_features_tensor = torch.tensor(extra_features, dtype=torch.float32).to(device)
            outputs = model(inputs['input_ids'].to(device), inputs['attention_mask'].to(device), extra_features_tensor)
            
            # 확률값
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            top_3_machinery_indices = torch.topk(probabilities, 3, dim=1).indices.cpu().numpy()
            
            return top_3_machinery_indices  
    except Exception as e:
        return None

def predict_assembly(model, X_seq):
    try:
        predictions = model.predict_proba(X_seq) 
        top_3_indices = np.argsort(predictions, axis=1)[:, -3:][:, ::-1]  # 확률순으로 정렬
        
        return top_3_indices  
    except Exception as e:
        return None

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the API"})

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(current_dir, 'static'), 'favicon.ico')

@app.route('/predict_machinery', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print(f"Received data : {data}")

        item = request.json['item']
        supplier = request.json['supplier']
        part_no = request.json['part_no']
        currency = request.json['currency']
        price = request.json['price']

        print(f"Item: {item}, Supplier: {supplier}, Part No: {part_no}, Currency: {currency}, Price: {price}")

        cleaned_item = preprocess_text(item)
        cleaned_supplier = clean_supplier_name(supplier)  
        combined_text = cleaned_item + " " + part_no + " " + cleaned_supplier
        print(f"Combined text: {combined_text}")

        exchange_rates = {'USD': 1, 'KRW': 0.00078, 'EUR': 1.18, 'JPY': 0.0091}
        converted_price = float(price) * exchange_rates[currency]
        converted_price_log = np.log1p(converted_price)
        
        currency_encoded = currency_ohe.transform([[currency]])  # One-Hot 인코딩
        price_scaled = scaler.transform([[converted_price_log]])  # 가격 스케일링
        extra_features = np.hstack([currency_encoded, price_scaled])  # 결합

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        extra_features_tensor = torch.tensor(extra_features, dtype=torch.float32).to(device)
        top_3_machinery_predictions = predict_machinery(machinery_optimized_model, [combined_text], extra_features_tensor, device)

        # 상위 3개의 Machinery 예측 중 첫 번째를 Assembly 입력으로 사용
        machinery_prediction_for_assembly = top_3_machinery_predictions[0][0]

        X_seq = encode_data_assembly([combined_text])
        X_seq_with_machinery = np.hstack([X_seq, machinery_prediction_for_assembly.reshape(-1, 1)])

        assembly_prediction_indices = predict_assembly(assembly_optimized_model, X_seq_with_machinery)

        top_3_machinery_labels = label_encoder_machinery.inverse_transform(top_3_machinery_predictions[0])
        top_3_assembly_labels = label_encoder_assembly.inverse_transform(assembly_prediction_indices[0])

        return jsonify({
            'machinery_top_3': top_3_machinery_labels.tolist(),
            'assembly_top_3': top_3_assembly_labels.tolist()
        })
    
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500 

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 