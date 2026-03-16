import os
import json
import time
from openai import OpenAI

# === 설정 ===
# [중요] OpenAI API 키를 여기에 넣으세요
API_KEY = ""  # 본인의 OpenAI API 키 입력
DATA_DIR = "data"

# 클라이언트 설정
client = OpenAI(api_key=API_KEY)

# 모델 설정 (Gemini Flash와 비슷한 가성비/속도 모델인 gpt-4o-mini 사용)
# 더 높은 성능을 원하면 "gpt-4o"로 변경 가능
MODEL_NAME = "gpt-4.1-mini" 

def analyze_text_with_openai(text):
    """
    OpenAI(GPT)에게 텍스트 분석 및 추론 요청
    """
    
    # 시스템 프롬프트: AI의 역할과 응답 형식을 정의
    system_prompt = """
    당신은 보이스피싱 범죄 데이터를 프로파일링하는 최고의 보안 전문가입니다.
    사용자가 입력한 [분석 대상 텍스트]를 읽고, 지시사항에 따라 8가지 정보를 JSON으로 추출하세요.

    [지시사항]
    1. 텍스트에 명시적인 정보가 없다면, 문맥과 보이스피싱 유형을 고려하여 **가장 합리적인 내용을 추론(Inference)하여 채우세요.**
    2. 절대 "알 수 없음", "Null"로 비워두지 마세요.
    3. 반드시 아래 JSON 형식으로만 응답하세요.

    [추출할 JSON 스키마]
    {
        "attack_type": "공격 유형 (예: 기관사칭형, 대출사기형)",
        "impersonated_entity": "사칭 대상 (예: 검사, 수사관, 은행원)",
        "keywords": ["주요 키워드 5개 (배열)"],
        "pressure_points": "피해자를 심리적으로 압박한 포인트 (추론 필수)",
        "money_demand_method": "금전 요구 방식 (계좌이체, 현금전달 등 추론)",
        "legitimacy_tactics": "신뢰를 얻기 위해 사용한 장치 (위조 공문, 가짜 사이트 등)",
        "victim_vulnerability": "피해자의 취약한 상황 (급전 필요, 법적 무지 등 추론)",
        "critical_deception": "피해자가 속게 된 결정적 속임수 (추론)"
    }
    """

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"[분석 대상 텍스트]\n{text}"}
            ],
            response_format={"type": "json_object"}, # JSON 강제 출력 모드
            temperature=0.2, # 분석 작업이므로 창의성(랜덤성)을 낮춤
        )
        
        # 결과 텍스트를 JSON으로 변환
        result_text = response.choices[0].message.content
        return json.loads(result_text)

    except Exception as e:
        print(f"  -> OpenAI API 오류: {e}")
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

        print(f"\n[GPT 분석 중] {file_name} ...")
        
        with open(file_path, 'r', encoding='utf-8-sig') as f:
            content = f.read()

        if len(content) < 30:
            print("  -> 내용이 너무 짧아 건너뜁니다.")
            continue

        result = analyze_text_with_openai(content)

        if result:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=4)
            print("  -> 저장 완료")
        
        # [중요] OpenAI도 티어에 따라 속도 제한이 있으므로 안전하게 대기
        time.sleep(1)

if __name__ == "__main__":
    main()
