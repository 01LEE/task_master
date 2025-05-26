const fs = require('fs');
const path = require('path');

// AI 번역 함수 (OpenAI API 사용 예시)
async function translateText(text, targetLang) {
  // 실제로는 OpenAI API나 Google Translate API 사용
  console.log(`Translating "${text}" to ${targetLang}`);
  // API 호출 로직
}

// 새로운 키 추가 시 자동 번역
async function addTranslationKey(keyPath, koreanText) {
  const localesDir = path.join(__dirname, '../public/locales');
  
  // 각 언어별로 번역 및 추가
  const languages = ['en', 'ja'];
  
  for (const lang of languages) {
    const filePath = path.join(localesDir, lang, 'common.json');
    const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // 번역된 텍스트 얻기
    const translatedText = await translateText(koreanText, lang);
    
    // 중첩된 키 경로 처리
    const keys = keyPath.split('.');
    let current = translations;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = translatedText;
    
    // 파일 저장
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
  }
}

// 사용 예시
// addTranslationKey('newFeature.title', '새로운 기능');

module.exports = { addTranslationKey }; 