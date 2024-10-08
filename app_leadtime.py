from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import pickle
import re
import os
import requests
import certifi
import urllib3

from gensim.models import Word2Vec
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime, timedelta
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

current_dir = os.path.dirname(os.path.abspath(__file__))

word2vec_machinery = Word2Vec.load(os.path.join(current_dir, 'models', 'word2vec_machinery.model'))
word2vec_assembly = Word2Vec.load(os.path.join(current_dir, 'models', 'word2vec_assembly.model'))
word2vec_supplier = Word2Vec.load(os.path.join(current_dir, 'models', 'word2vec_supplier.model'))

with open(os.path.join(current_dir, 'models', '1001_leadtimemodel.pkl'), 'rb') as f:
    leadtime_model = pickle.load(f)

with open(os.path.join(current_dir, 'models', 'MinMaxScaler.pkl'), 'rb') as f:
    scaler = pickle.load(f)

with open(os.path.join(current_dir, 'models', 'OneHotEncoder.pkl'), 'rb') as f:
    currency_encoder = pickle.load(f)

df_fixed = pd.read_csv(os.path.join(current_dir, 'csv', '1001_features.csv'))

combined_vectors = np.load(os.path.join(current_dir, 'csv', 'combined_vectors.npy'))
df_fixed['combined_vector'] = list(combined_vectors)


month_columns = ['month_2', 'month_3', 'month_4', 'month_5', 'month_6', 'month_7', 'month_8', 'month_9', 'month_10', 'month_11', 'month_12']
day_of_week_columns = ['day_of_week_1', 'day_of_week_2', 'day_of_week_3', 'day_of_week_4', 'day_of_week_5', 'day_of_week_6']
season_columns = ['season_겨울', 'season_봄', 'season_여름']

def sentence_vector(sentence, model):
    vectors = [model.wv[word] for word in sentence if word in model.wv]
    if len(vectors) > 0:
        return np.mean(vectors, axis=0)
    else:
        return np.zeros(model.vector_size)
 
# 시즌 함수
def get_season(date):
    month = date.month
    if month in [3, 4, 5]:
        return '봄'
    elif month in [6, 7, 8]:
        return '여름'
    elif month in [9, 10, 11]:
        return '가을'
    else:
        return '겨울'



# 텍스트 전처리 함수
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'\([^)]*\)', '', text)
    text = re.sub(r'[^\w\s\*/\-\+.,#&]', '', text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\b(사용금지|사)\b', '', text, flags=re.IGNORECASE)
    return text.strip()



# 발주처 전처리 함수
def clean_supplier_name(name):
    name = name.lower()
    name = re.sub(r'coporation|coropration|coproration|corporration', 'corporation', name)
    name = re.sub(r'\(사용금지\)', '', name)
    name = re.sub(r'u\.s\.a', '_usa', name)
    name = re.sub(r'\.', '', name)
    suffixes = r'(corporation|corp|company|co|incorporated|inc|limited|ltd|상사|공사|엔지니어링|주식회사|주|gmbh|pte ltd|llc)'
    name = re.sub(suffixes, '', name, flags=re.IGNORECASE)
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'\s+', ' ', name).strip()
    return name


# 환율 함수
def get_exchange_rate(currency, request_date):
    if currency == 'KRW':
        return 1


    try:
        date = datetime.strptime(request_date, '%Y-%m-%d') - timedelta(days=1)
    except ValueError:
        print("Invalid requestDate format")
        return 1

    formatted_date = date.strftime('%Y%m%d')

    api_key = os.getenv('EXCHANGE_API_KEY')
    print(f"API Key: {api_key}")  # API 키 출력

    if not api_key:
        print("API 키가 설정되지 않았습니다.")
        return 1

    url = f"https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey={api_key}&searchdate={formatted_date}&data=AP01"
    
    # SSL 경고 무시 일단 되게한다.
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    response = requests.get(url, verify=False)

    if response.status_code == 200:
        try:
            data = response.json()
            for item in data:
                if item['cur_unit'] == currency:
                    deal_bas_r = item['deal_bas_r']
                    if deal_bas_r:
                        return float(deal_bas_r.replace(',', ''))
        except ValueError:
            print("JSON 디코딩 오류 발생")
    else:
        print(f"API 요청 실패: 상태 코드 {response.status_code}")

    return 1

def pandemic_flag(year):
    return 1 if year in [2020, 2021] else 0

def validate_input(data):
    required_fields = ['requestDate', 'releaseDate', 'machinery', 'assembly', 'supplier', 'currency']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return False, f"Missing fields: {', '.join(missing_fields)}"
    return True, ""

@app.route('/')
def home():
    return "Welcome to the Lead Time Prediction API"

@app.route('/predict_leadtime', methods=['POST'])
def predict_leadtime():
    data = request.get_json()
    print(data)

    # 입력 데이터 검증
    valid, message = validate_input(data)
    if not valid:
        return jsonify({'error': message}), 400
    
    request_date = data.get('requestDate')
    release_data_str = data.get('releaseDate')
    machinery = data.get('machinery')
    assembly = data.get('assembly')
    supplier = data.get('supplier')
    currency = data.get('currency')

    try:
        release_date = datetime.strptime(release_data_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({'error':'Invalid releaseDate format. Use YYYY-MM-DD format'}), 400

    import_date = release_date - timedelta(days=1)

    month = import_date.month
    day_of_week = import_date.weekday()
    year = import_date.year
    season = get_season(import_date)


    # 원-핫 인코딩된 피처 생성 및 컬럼 정렬
    month_features_df = pd.get_dummies([month], prefix='month')
    month_features_df = month_features_df.reindex(columns=month_columns, fill_value=0)
    month_features = month_features_df.values.flatten()

    day_of_week_features_df = pd.get_dummies([day_of_week], prefix='day_of_week')
    day_of_week_features_df = day_of_week_features_df.reindex(columns=day_of_week_columns, fill_value=0)
    day_of_week_features = day_of_week_features_df.values.flatten()

    season_features_df = pd.get_dummies([season], prefix='season')
    season_features_df = season_features_df.reindex(columns=season_columns, fill_value=0)
    season_features = season_features_df.values.flatten()
  
    cleaned_machinery = preprocess_text(machinery)
    cleaned_assembly = preprocess_text(assembly)
    cleaned_supplier = clean_supplier_name(supplier)
    
    # 고정 피처 매칭 - 먼저 정확히 일치하는 조합이 있는지 확인
    matching_rows = df_fixed[
        (df_fixed['cleaned_machinery'] == cleaned_machinery) &
        (df_fixed['cleaned_assembly'] == cleaned_assembly) &
        (df_fixed['cleaned_supplier'] == cleaned_supplier)
    ]

    if not matching_rows.empty:
        most_similar_row = matching_rows.iloc[0]
        # 정확히 일치하는 데이터가 있을 때도 machinery_vector, assembly_vector, supplier_vector 할당
        machinery_vector = sentence_vector(cleaned_machinery.split(), word2vec_machinery)
        assembly_vector = sentence_vector(cleaned_assembly.split(), word2vec_assembly)
        supplier_vector = sentence_vector(cleaned_supplier.split(), word2vec_supplier)
    else:
        # 정확히 일치하는 데이터가 없는 경우, 벡터 유사도 기반으로 유사한 조합 찾기
        machinery_vector = sentence_vector(cleaned_machinery.split(), word2vec_machinery)
        assembly_vector = sentence_vector(cleaned_assembly.split(), word2vec_assembly)
        supplier_vector = sentence_vector(cleaned_supplier.split(), word2vec_supplier)

        input_combined_vector = np.hstack((machinery_vector, assembly_vector, supplier_vector))
        similarities = cosine_similarity([input_combined_vector], df_fixed['combined_vector'].tolist())
        most_similar_idx = similarities.argmax()
        most_similar_row = df_fixed.iloc[most_similar_idx]

    # 필요한 피처 추출
    machinery_assembly_supplier_avg_leadtime = most_similar_row['machinery_assembly_supplier_avg_leadtime']
    supplier_machinery_avg_leadtime = most_similar_row['supplier_machinery_avg_leadtime']
    machinery_avg_leadtime = most_similar_row['machinery_avg_leadtime']

    exchange_rate = get_exchange_rate(currency, request_date)
    year_exchange_rate = year * exchange_rate

    numerical_features = pd.DataFrame([[machinery_assembly_supplier_avg_leadtime, supplier_machinery_avg_leadtime, machinery_avg_leadtime, year_exchange_rate]],
                                  columns=['machinery_assembly_supplier_avg_leadtime', 'supplier_machinery_avg_leadtime', 'machinery_avg_leadtime', 'year_exchange_rate'])

    scaled_numerical_features = scaler.transform(numerical_features).flatten()

    pandemic_flag_value = pandemic_flag(year)
    
    try:
    # 예측 시에도 원핫 인코더가 학습할 때 사용한 것처럼 데이터프레임으로 변환하여 인코딩
        currency_df = pd.DataFrame([[currency]], columns=['견적화폐'])
        currency_encoded = currency_encoder.transform(currency_df).flatten()
    except Exception as e:
        return jsonify({'error': f'Currency encoding error: {str(e)}'}), 400

    X = np.hstack((
        scaled_numerical_features,
        month_features,
        day_of_week_features,
        season_features,
        currency_encoded,
        [pandemic_flag_value],
        machinery_vector,
        assembly_vector
    ))


    # 예측 수행
    try:
        predicted_lead_time = leadtime_model.predict([X])[0]
        predicted_lead_time = int(predicted_lead_time)
    except Exception as e:
        return jsonify({'error': f'Prediction error: {str(e)}'}), 500

    return jsonify({'predicted_lead_time': predicted_lead_time})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

