# RareBridge

RareBridge는 환자의 자유 텍스트 증상을 **HPO (Human Phenotype Ontology)** 기반으로 표준화하고, 공개 희귀질환 데이터베이스를 활용해 질환 후보와 근거 정보를 제공하는 **희귀질환 감별진단 보조 프로토타입 서비스**입니다.

희귀질환은 증상이 다양한 질환과 겹치고 인지도가 낮아 진단까지 오랜 시간이 걸리는 경우가 많습니다.  
RareBridge는 **증상 기반 질환 탐색 시스템**을 통해 희귀질환 감별진단을 보조하는 것을 목표로 합니다.

---

## Work Flow

1. Issue 템플릿을 통해 작업 일감을 생성합니다.
2. Issue 번호를 기준으로 브랜치를 생성합니다.
3. 브랜치에서 작업 후 커밋합니다.
4. Pull Request를 생성합니다.
5. 코드 리뷰 후 `main` 브랜치에 merge 합니다.

---

## Branch Strategy

본 프로젝트는 **Trunk-Based Development** 전략을 따릅니다.

- `main` 브랜치를 기준으로 개발을 진행합니다.
- 기능 개발 및 수정은 별도의 브랜치에서 진행합니다.
- 작업 완료 후 Pull Request를 통해 `main` 브랜치에 병합합니다.

참고  
https://tech.mfort.co.kr/blog/2022-08-05-trunk-based-development/

---

## Commit Convention

커밋 메시지는 아래 형식을 따릅니다.
[ISSUE-ID][TAG] Commit message

## Commit Tag
작업 유형을 나타내는 태그입니다.

| Tag | Description |
|-----|-------------|
| Add | 새로운 기능 추가 |
| Fix | 버그 수정 |
| Change | 기존 기능 수정 |
| Improve | 코드 개선 또는 성능 개선 |
| Migrate | 데이터 구조 또는 시스템 구조 변경 |

### Commit Message
- 작업 내용을 간단하고 명확하게 작성합니다.
- 무엇을 구현하거나 수정했는지 한 줄로 설명합니다.

---

## Ground Rules

- 커밋 메시지는 `[ISSUE-ID][TAG] Commit message` 형식을 사용합니다.
- 브랜치는 **Trunk-Based Development** 전략을 따릅니다.
- 디펜던시 관리가 필요한 모듈 및 라이브러리는 환경 파일에 기록합니다.
- 학습 데이터 및 모델 객체는 저장소에 업로드하지 않습니다.
- 주요 코드에는 주석 설명을 작성합니다.
- Pull Request 후 코드 리뷰를 진행합니다.

---

## Contributors
