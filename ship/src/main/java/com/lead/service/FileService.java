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
	   // 파일을 저장하는 메서드
    public String storeFile(MultipartFile file) throws IOException {
        // 파일 이름을 정리하여 저장
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        // 파일 이름에 부적합한 문자가 있는지 확인
        if (fileName.contains("..")) {
            throw new IOException("파일 이름에 부적합한 문자가 포함되어 있습니다: " + fileName);
        }

        // 파일 저장 경로 설정 및 파일 복사
        Path targetLocation = this.fileStorageLocation.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return fileName;  // 저장된 파일 이름 반환
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
