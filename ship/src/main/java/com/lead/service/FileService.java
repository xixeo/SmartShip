package com.lead.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {

	private final Path fileStorageLocation;

	// 사용자 정의 프로퍼티 값을 읽어 파일 경로로 설정
	public FileService(@Value("${file.upload-dir}") String uploadDir) {
		this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

		try {
			Files.createDirectories(this.fileStorageLocation);
		} catch (Exception ex) {
			throw new RuntimeException("파일 저장 경로를 생성할 수 없습니다.", ex);
		}
	}

	public Resource loadFileAsResource(String fileName) {
	    try {
	        Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
	        
	        // 파일 경로 디버깅
	        System.out.println("파일을 로드하는 경로: " + filePath.toString());

	        Resource resource = new UrlResource(filePath.toUri());

	        if (resource.exists() && resource.isReadable()) {
	            return resource;
	        } else {
	            throw new RuntimeException("파일을 찾을 수 없거나 읽을 수 없습니다.");
	        }
	    } catch (MalformedURLException ex) {
	        throw new RuntimeException("파일을 찾을 수 없습니다.", ex);
	    }
	}

	//////////////////////////////////////////////////////////파일 저장
	public String storeFile(MultipartFile file) throws IOException {
	    String fileName = StringUtils.cleanPath(file.getOriginalFilename());

	    // 로그로 파일 저장 경로와 파일명 확인
	    System.out.println("저장되는 파일 이름: " + fileName);
	    System.out.println("파일이 저장되는 경로: " + this.fileStorageLocation.toString());

	    if (fileName.contains("..")) {
	        throw new IOException("파일 이름에 부적합한 문자가 포함되어 있습니다: " + fileName);
	    }

	    Path targetLocation = this.fileStorageLocation.resolve(fileName);
	    Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

	    return fileName;
	}

    //////////////////////////////////////////////////////////파일 삭제
    public void deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);  // 파일이 존재하면 삭제
        } catch (IOException e) {
            throw new RuntimeException("파일을 삭제하는 중 오류가 발생했습니다: " + fileName, e);
        }
    }
}
