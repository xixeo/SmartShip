import React, { useEffect, useState } from 'react'
import { useLoading } from "../Compo/LoadingContext";
import { useAlert } from "../Compo/AlertContext";
import { useParams } from 'react-router-dom';


export default function AnnounceEdit() {
  const { noticeid } = useParams();
  const [ANdata,setANdata] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { setLoading } = useLoading();
  const { showAlert } = useAlert();
  const token = localStorage.getItem("token");
  
  console.log('id',noticeid)

  const fetchgetAnnounce = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/notice/${noticeid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
        })
        if (!response.ok) {
          throw new Error("WriteAnnounce response was not ok");
        }
        const adata = await response.json();
        console.log("공지받기확인", adata)
        setANdata(adata)
        setTitle(adata.title); // 기존 제목으로 상태 초기화
        setContent(adata.content); // 기존 내용으로 상태 초기화
        setFile(adata.attachment)
        showAlert("공지사항이 성공적으로 조회되었습니다.", "success")
      } catch (e) {
        console.error("Failed to fetch getAnnounce", e)
        showAlert("공지사항 조회가 실패했습니다.", "error")
      } finally {
        setLoading(false)
      }
    }

  useEffect(()=>{
    fetchgetAnnounce(noticeid)
  },[noticeid])

  // 파일명 추출 함수
  const getFileNameFromPath = (path) => {
    return path ? path.split('/').pop() : '';
  }

  const handleEdit = async () => {
    if (!title || !content) {
      showAlert("제목과 내용을 입력해주세요.", "success");
      return;
    }
    setLoading(true)

    const formData = new FormData();
    formData.append('title', title); // 제목 추가
    formData.append('content', content); // 내용 추가
    
    // if(file) {
    // formData.append('file', file); // 파일을 FormData에 추가
    // }
    console.log('수정확인',formData)
    try {
      const response = await fetch(`/notice/${noticeid}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      if (!response.ok) {
        throw new Error("WriteAnnounce response was not ok");
      }
      showAlert("공지사항이 수정되었습니다.", "success")
    } catch (e) {
      console.error('Failed to fetch write Announce', e)
      showAlert("공지사항 수정이 실패되었습니다.", "error")
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
        공지사항 수정
      </div>
      <div className='flex flex-col p-2'>
        <div className='flex items-center mb-2'>
          <h1 className='text-white w-24'>제목</h1>
          <input className='ml-5 w-full bg-[#2D374A] h-8 text-white' value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className='flex items-center mb-2'>
          {/* <h1 className='text-white w-24'>파일첨부</h1>
          <input type="file" onChange={handleFileChange} value={ANdata.attachment} className='ml-5 w-full bg-[#2D374A] h-9 text-white' /> */}
          {ANdata.attachment && (
            <div className='flex'>
            <h1 className='text-white w-24'>첨부된 파일 </h1>
            <h1 className='text-white ml-5'>{getFileNameFromPath(file)}</h1>
            <a href={file.attachment} target="_blank" rel="noopener noreferrer" className='text-white bg-[#9c87ff] border-[#9c87ff] rounded-md ml-3 px-3' download>
              다운로드
            </a>
          </div>
          )}
        </div>

        <div className='flex items-center mb-2'>
          <h1 className='text-white w-24'>내용</h1>
          <textarea rows={10} className='ml-5 w-full h-48 bg-[#2D374A] text-white' value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        </div>
      </div>
      <div className='mt-3 flex justify-end'>
        <button className='blue-btn2' onClick={()=>handleEdit(noticeid)}> 수정 </button>
      </div>
    </div>
  )
}
