import React, { useState } from 'react';

const PredictionForm = () => {
    const [formData, setFormData] = useState({
        item: '',
        supplier: '',
        part_no: '',
        price: '',
        currency: 'USD'
    });
    
    const [machineryOptions, setMachineryOptions] = useState([]);
    const [assemblyOptions, setAssemblyOptions] = useState([]);
    
    const [machineryVisible, setMachineryVisible] = useState(false);
    const [assemblyVisible, setAssemblyVisible] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://10.125.121.178:5000/predict_machinery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((result) => {
            setMachineryOptions(result.machinery_top_3);
            setAssemblyOptions(result.assembly_top_3);
            setMachineryVisible(true);
            setAssemblyVisible(true);
        })
        .catch((error) => {
            console.error('Error during prediction:', error);
        });
    };

    return (
        <div className="ui container text-white mt-10">
            <h2 className="ui header text-white text-4xl mb-4">Machinery & Assembly Prediction</h2>
            <p>다음 정보를 입력하여 Machinery 및 Assembly를 예측하세요.</p>

            <form className="ui form" onSubmit={handleSubmit}>
                <div className="field mb-4">
                    <label className="text-white">청구품목 (Claim Item)</label>
                    <input 
                        type="text" 
                        name="item" 
                        value={formData.item}
                        onChange={handleChange}
                        placeholder="청구품목을 입력하세요" 
                        required 
                        className="bg-gray-700 text-white p-2 rounded"
                    />
                </div>

                <div className="field mb-4">
                    <label className="text-white">발주처 (Supplier)</label>
                    <input 
                        type="text" 
                        name="supplier" 
                        value={formData.supplier}
                        onChange={handleChange}
                        placeholder="발주처를 입력하세요" 
                        required 
                        className="bg-gray-700 text-white p-2 rounded"
                    />
                </div>

                <div className="field mb-4">
                    <label className="text-white">품번 (Part No.)</label>
                    <input 
                        type="text" 
                        name="part_no" 
                        value={formData.part_no}
                        onChange={handleChange}
                        placeholder="품번을 입력하세요" 
                        required 
                        className="bg-gray-700 text-white p-2 rounded"
                    />
                </div>

                <div className="field mb-4">
                    <label className="text-white">가격 (Price)</label>
                    <input 
                        type="number" 
                        name="price" 
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="가격을 입력하세요" 
                        required 
                        className="bg-gray-700 text-white p-2 rounded"
                    />
                </div>

                <div className="field mb-4">
                    <label className="text-white">통화 (Currency)</label>
                    <select 
                        name="currency" 
                        value={formData.currency}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 text-white p-2 rounded"
                    >
                        <option value="USD">USD (미국 달러)</option>
                        <option value="KRW">KRW (한국 원)</option>
                        <option value="EUR">EUR (유로)</option>
                        <option value="JPY">JPY (일본 엔)</option>
                    </select>
                </div>

                <button className="ui button bg-blue-500 hover:bg-blue-600 text-white p-3 rounded">예측하기</button>
            </form>

            {machineryVisible && (
                <div className="ui segment bg-gray-800 p-4 rounded mt-4">
                    <h3 className="ui header text-white">Machinery 예측 결과</h3>
                    <label className="text-white">Machinery 선택:</label>
                    <select className="ui dropdown bg-gray-700 text-white p-2 rounded">
                        {machineryOptions.map((machinery, index) => (
                            <option key={index} value={machinery}>
                                {machinery}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {assemblyVisible && (
                <div className="ui segment bg-gray-800 p-4 rounded mt-4">
                    <h3 className="ui header text-white">Assembly 예측 결과</h3>
                    <label className="text-white">Assembly 선택:</label>
                    <select className="ui dropdown bg-gray-700 text-white p-2 rounded">
                        {assemblyOptions.map((assembly, index) => (
                            <option key={index} value={assembly}>
                                {assembly}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default PredictionForm;
