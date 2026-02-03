import os
import json
import time
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

# === 설정 ===
# [중요] 구글 AI 스튜디오에서 받은 키를 여기에 넣으세요
API_KEY = "AIzaSyDKNOun-pa-TNVVktob9PsVJg-VASdkrq4" 
DATA_DIR = "data"

# 라이브러리 설정
genai.configure(api_key=API_KEY)

# 모델 설정 (무료이면서 빠르고 똑똑한 Flash 모델 사용)
model = genai.GenerativeModel(
    model_name="models/gemini-2.5-flash",
    generation_config={"response_mime_type": "application/json"} # JSON 강제 출력 모드
)

def analyze_text_with_gemini(text):
    """
    Gemini에게 텍스트 분석 및 추론 요청
    """
    
    prompt = f"""
    당신은 보이스피싱 범죄 데이터를 프로파일링하는 최고의 보안 전문가입니다.
    아래 [분석 대상 텍스트]를 읽고, 지시사항에 따라 8가지 정보를 JSON으로 추출하세요.

    [지시사항]
    1. 텍스트에 명시적인 정보가 없다면, 문맥과 보이스피싱 유형을 고려하여 **가장 합리적인 내용을 추론(Inference)하여 채우세요.**
    2. 절대 "알 수 없음", "Null"로 비워두지 마세요.
    3. JSON 형식으로만 응답하세요.

    [추출할 JSON 항목]
    {{
        "attack_type": "공격 유형 (예: 기관사칭형, 대출사기형)",
        "impersonated_entity": "사칭 대상 (예: 검사, 수사관, 은행원)",
        "keywords": ["주요 키워드 5개 (배열)"],
        "pressure_points": "피해자를 심리적으로 압박한 포인트 (추론 필수)",
        "money_demand_method": "금전 요구 방식 (계좌이체, 현금전달 등 추론)",
        "legitimacy_tactics": "신뢰를 얻기 위해 사용한 장치 (위조 공문, 가짜 사이트 등)",
        "victim_vulnerability": "피해자의 취약한 상황 (급전 필요, 법적 무지 등 추론)",
        "critical_deception": "피해자가 속게 된 결정적 속임수 (추론)"
    }}

    [분석 대상 텍스트]
    {text}
    """

    try:
        # 안전 설정 (보이스피싱 텍스트라 범죄 내용이 포함되므로 필터링 강도를 낮춤)
        safety_settings = {
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        }

        response = model.generate_content(prompt, safety_settings=safety_settings)
        
        # 결과 텍스트를 JSON으로 변환
        return json.loads(response.text)

    except Exception as e:
        print(f"  -> Gemini API 오류: {e}")
        return None

def main():
    if not os.path.exists(DATA_DIR):
        print("data 폴더가 없습니다.")
        return

    # txt 파일만 골라내기
    files = [f for f in os.listdir(DATA_DIR) if f.endswith(".txt")]
    print(f"총 {len(files)}개의 파일을 분석합니다.")

    for file_name in files:
        # 이미 분석된 파일(_analysis.json)은 건너뛰기
        if "_analysis.json" in file_name:
            continue

        file_path = os.path.join(DATA_DIR, file_name)
        output_name = file_name.replace(".txt", "_analysis.json")
        output_path = os.path.join(DATA_DIR, output_name)

        # 결과 파일이 이미 있으면 스킵
        if os.path.exists(output_path):
            continue

        print(f"\n[Gemini 분석 중] {file_name} ...")
        
        with open(file_path, 'r', encoding='utf-8-sig') as f:
            content = f.read()

        if len(content) < 30:
            print("  -> 내용이 너무 짧아 건너뜁니다.")
            continue

        result = analyze_text_with_gemini(content)

        if result:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=4)
            print("  -> 저장 완료")
        
        # [중요] 무료 버전은 1분에 15회 요청 제한이 있으므로 안전하게 4초 쉼
        time.sleep(4)

if __name__ == "__main__":
    main()