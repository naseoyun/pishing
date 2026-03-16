import os
import time
import requests
from bs4 import BeautifulSoup
import re

# === 설정 ===
# 금융감독원 보이스피싱 지킴이 사이트 도메인 (HTML 구조 기반 추정)
BASE_DOMAIN = "https://www.fss.or.kr"
# 게시판 목록 기본 URL (menuNo는 제공해주신 링크 참조)
BASE_LIST_URL = "https://www.fss.or.kr/fss/bbs/B0000203/list.do?menuNo=200686"
SAVE_DIR = "data_voice"
TARGET_COUNT = 50

# === 헤더 설정 (봇 차단 방지용) ===
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def clean_filename(filename):
    """파일 이름에서 윈도우/리눅스 금지 문자를 제거하고 공백 정리"""
    filename = re.sub(r'[\\/*?:"<>|]', "", filename)
    return filename.strip()

def download_file(url, folder, filename):
    """파일을 실제로 다운로드하는 함수"""
    try:
        if not filename.endswith('.mp4'):
            filename += '.mp4'
            
        file_path = os.path.join(folder, filename)
        
        # 이미 존재하는 파일이면 건너뛰기 (선택 사항)
        if os.path.exists(file_path):
            print(f"  [Skip] 이미 존재함: {filename}")
            return True

        with requests.get(url, headers=HEADERS, stream=True) as r:
            r.raise_for_status()
            with open(file_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
        print(f"  [완료] 저장됨: {filename}")
        return True
    except Exception as e:
        print(f"  [실패] 다운로드 에러 ({filename}): {e}")
        return False

def main():
    # 저장 폴더 생성
    if not os.path.exists(SAVE_DIR):
        os.makedirs(SAVE_DIR)
        print(f"📂 '{SAVE_DIR}' 폴더를 생성했습니다.")

    download_count = 0
    page_index = 1

    while download_count < TARGET_COUNT:
        print(f"\n📄 페이지 {page_index} 검색 중... (현재 {download_count}/{TARGET_COUNT}개)")
        
        # 목록 페이지 요청
        list_url = f"{BASE_LIST_URL}&pageIndex={page_index}"
        try:
            res = requests.get(list_url, headers=HEADERS)
            soup = BeautifulSoup(res.text, 'html.parser')
        except Exception as e:
            print(f"네트워크 오류: {e}")
            break

        # 상세 페이지 링크 찾기 (제공해주신 HTML의 view.do 링크 패턴)
        # href가 "/fss/bbs/B0000203/view.do"로 시작하는 a 태그 검색
        article_links = soup.find_all('a', href=lambda x: x and '/fss/bbs/B0000203/view.do' in x)

        if not article_links:
            print("더 이상 게시물이 없습니다. 종료합니다.")
            break

        # 각 게시물로 들어가서 파일 다운로드
        for link in article_links:
            if download_count >= TARGET_COUNT:
                break

            view_url = BASE_DOMAIN + link['href']
            
            try:
                # 상세 페이지 접속
                view_res = requests.get(view_url, headers=HEADERS)
                view_soup = BeautifulSoup(view_res.text, 'html.parser')

                # 다운로드 링크 찾기 (제공해주신 HTML의 apiVodDownload.do 패턴)
                # mp4 파일이 포함된 다운로드 링크 검색
                download_tag = view_soup.find('a', href=lambda x: x and 'apiVodDownload.do' in x)
                
                if download_tag:
                    download_url = BASE_DOMAIN + download_tag['href']
                    
                    # 파일명 추출 (span class="name" 내부 텍스트)
                    name_span = download_tag.find('span', class_='name')
                    if name_span:
                        # "금감원_보이스피싱_12.mp4(파일크기...)" 형태에서 파일명만 분리
                        raw_name = name_span.get_text(strip=True)
                        # (파일크기...) 부분 제거 및 확장자 보정
                        file_name = raw_name.split('(')[0].strip()
                        file_name = clean_filename(file_name)
                    else:
                        file_name = f"voice_phishing_{download_count+1}.mp4"

                    # 다운로드 실행
                    if download_file(download_url, SAVE_DIR, file_name):
                        download_count += 1
                    
                    # 서버 부하 방지를 위한 짧은 대기
                    time.sleep(1) 
                
            except Exception as e:
                print(f"상세 페이지 처리 중 오류: {e}")
                continue

        page_index += 1
        time.sleep(1) # 페이지 넘길 때 대기

    print(f"\n✅ 총 {download_count}개의 파일 다운로드가 완료되었습니다.")

if __name__ == "__main__":
    main()
