import React, { useEffect,useState } from 'react'
import { useLoading } from "../Compo/LoadingContext";
import { useAlert } from "../Compo/AlertContext";

export default function AnnounceWrite() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { setLoading } = useLoading();
  const { showAlert } = useAlert();
  const token = localStorage.getItem("token");


  const handleWrite = async () => {
    if (!title || !content) {
      showAlert("제목과 내용을 입력해주세요.","success");
      return;
    }
    setLoading(true)
    
    const formData = new FormData();
    formData.append('title', title); // 제목 추가
    formData.append('file', file); // 파일을 FormData에 추가
    formData.append('content', content); // 내용 추가

    try {
      const response = await fetch('notice', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      if (!response.ok) {
        throw new Error("WriteAnnounce response was not ok");
      }
      showAlert("공지사항이 등록되었습니다.", "success")
    } catch (e) {
      console.error('Failed to fetch write Announce',e)
      showAlert("공지사항 등록이 실패되었습니다.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // 파일 선택
  };

  return (
    <div className='bg-[#162136] border-[#162136] rounded-lg p-3'>
      <div className="text-xl font-semibold text-white p-4">
        공지사항 등록
      </div>
      <div className='flex flex-col p-2'>
        <div className='flex items-center mb-2'>
          <h1 className='text-white w-24'>제목</h1>
          <input className='ml-5 w-full bg-[#2D374A] h-8 text-white' value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>

        <div className='flex items-center mb-2'>
          <h1 className='text-white w-24'>파일첨부</h1>
          <input type="file" onChange={handleFileChange} className='ml-5 w-full bg-[#2D374A] h-9 text-white' />
        </div>

        <div className='flex items-center mb-2'>
          <h1 className='text-white w-24'>내용</h1>
          <textarea rows={10} className='ml-5 w-full h-48 bg-[#2D374A] text-white' value={content}  onChange={(e) => setContent(e.target.value)}></textarea>
        </div>
      </div>
      <div className='mt-3 flex justify-end'>
        <button className='blue-btn2' onClick={handleWrite}> 등록 </button>
      </div>
    </div>
  )
}
