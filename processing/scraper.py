import os
import requests
import zipfile
import xml.etree.ElementTree as ET
import time
from bs4 import BeautifulSoup
import olefile
import zlib
import re

# === 설정 ===
BASE_URL = "https://www.fss.or.kr"
LIST_URL_TEMPLATE = "https://www.fss.or.kr/fss/bbs/B0000059/list.do?menuNo=200359&pageIndex={}"
SAVE_DIR = "data"
STOP_PHRASE = "개인정보 제공 및 자금 이체 요청은 무조건 거절하세요"

if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

def is_common_hangul(text):
    """
    놠, 쀌, 떘 같은 '깨진 한글(외계어)'을 걸러내는 필터입니다.
    우리가 실제로 쓰는 '상용 한글(EUC-KR)' 범위에 있는 글자만 남깁니다.
    """
    clean_chars = []
    for char in text:
        # 한글인 경우에만 검사
        if '가' <= char <= '힣':
            try:
                # EUC-KR로 변환되는지 확인 (실생활에 안 쓰이는 이상한 한글은 여기서 에러남)
                char.encode('euc-kr')
                clean_chars.append(char)
            except UnicodeEncodeError:
                # 변환 안 되면 깨진 글자로 간주하고 버림
                pass
        else:
            # 한글이 아니면(영어, 숫자, 기호 등) 그냥 둠
            clean_chars.append(char)
    return "".join(clean_chars)

def clean_text(text):
    """텍스트 정제 (기본 기호 외 특수문자 제거 + 외계어 한글 제거)"""
    if not text:
        return ""
    
    # 1. 먼저 외계어 한글(놠, 쀌 등) 제거
    text = is_common_hangul(text)

    # 2. 허용할 문자 범위 (한글, 영어, 숫자, 기본 기호, 줄바꿈)
    pattern = r"[^가-힣a-zA-Z0-9\s\.\,\(\)\-\%\[\]\~\!\@]"
    
    # 위 패턴 외의 잡동사니 문자 제거
    cleaned = re.sub(pattern, " ", text)
    
    # 3. 불필요한 공백 정리 (탭, 연속 공백 -> 공백 1개)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def extract_text_from_hwpx(filepath):
    """HWPX 텍스트 추출"""
    text_content = []
    try:
        with zipfile.ZipFile(filepath, 'r') as zf:
            section_files = [f for f in zf.namelist() if 'Contents/section' in f and f.endswith('.xml')]
            for section in section_files:
                xml_data = zf.read(section)
                root = ET.fromstring(xml_data)
                for elem in root.iter():
                    if elem.text:
                        text_content.append(elem.text)
        return "\n".join(text_content)
    except Exception as e:
        print(f"HWPX 읽기 실패 ({filepath}): {e}")
        return ""

def extract_text_from_hwp(filepath):
    """HWP 텍스트 추출"""
    text_content = []
    try:
        if not olefile.isOleFile(filepath):
            return ""
        f = olefile.OleFileIO(filepath)
        dirs = f.listdir()
        sections = [d for d in dirs if d[0] == "BodyText"]
        
        for section in sections:
            stream = f.openstream(section)
            data = stream.read()
            try:
                unpacked_data = zlib.decompress(data, -15)
            except:
                continue
            try:
                # HWP는 utf-16le를 쓰는데, 여기서 깨진 문자가 많이 나옴 -> 위쪽 clean_text에서 잡음
                extracted = unpacked_data.decode('utf-16le', errors='ignore')
                text_content.append(extracted)
            except:
                pass
        f.close()
        return "\n".join(text_content)
    except Exception as e:
        print(f"HWP 읽기 실패 ({filepath}): {e}")
        return ""

def process_page(page_num):
    url = LIST_URL_TEMPLATE.format(page_num)
    print(f"\n[페이지 {page_num} 처리 중] 접속: {url}")
    
    try:
        response = requests.get(url)
    except Exception as e:
        print(f"네트워크 오류: {e}")
        return

    if response.status_code != 200:
        print("접속 실패")
        return

    soup = BeautifulSoup(response.text, 'html.parser')
    links = soup.select("a.file-single")
    
    print(f" -> 발견된 파일 링크: {len(links)}개")

    for link in links:
        name_tag = link.find("span", class_="name")
        if not name_tag:
            continue
            
        file_name = name_tag.text.strip()
        
        if not file_name.lower().endswith(('.hwpx', '.hwp')):
            continue

        file_url = link['href']
        if not file_url.startswith('http'):
            file_url = BASE_URL + file_url
            
        save_path = os.path.join(SAVE_DIR, file_name)
        txt_save_path = save_path + ".txt"

        # 이미 텍스트 파일이 있으면 건너뛰기
        if os.path.exists(txt_save_path):
            print(f" -> 이미 완료됨 (스킵): {file_name}")
            # [중요] 혹시 텍스트 파일은 있는데 원본이 남아있다면 삭제
            if os.path.exists(save_path):
                os.remove(save_path)
            continue

        print(f" -> 처리 중: {file_name}")
        try:
            # 1. 다운로드
            file_res = requests.get(file_url)
            with open(save_path, 'wb') as f:
                f.write(file_res.content)
            
            # 2. 텍스트 추출
            if file_name.lower().endswith('.hwpx'):
                full_text = extract_text_from_hwpx(save_path)
            else:
                full_text = extract_text_from_hwp(save_path)
            
            # 3. 텍스트 정제 (깨진 글자 제거 + 필터링)
            clean_full_text = clean_text(full_text)
            
            # 4. 문구 자르기
            if STOP_PHRASE in clean_full_text:
                processed_text = clean_full_text.split(STOP_PHRASE)[0]
                processed_text += "\n\n[이하 내용은 자동 생략되었습니다]"
            else:
                processed_text = clean_full_text

            # 5. txt 저장
            with open(txt_save_path, 'w', encoding='utf-8-sig') as f:
                f.write(processed_text)
            
            # === [중요] 6. 원본 파일(.hwp, .hwpx) 삭제 ===
            if os.path.exists(save_path):
                os.remove(save_path)
                print("    -> 원본 파일 삭제 완료")

        except Exception as e:
            print(f" -> 에러 발생 ({file_name}): {e}")
        
        time.sleep(0.5)

def main():
    # 1페이지부터 9페이지까지
    for i in range(1, 10):
        process_page(i)

if __name__ == "__main__":
    main()