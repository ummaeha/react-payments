import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react'
import arrow from '../../assets/arrow.svg'
import question from '../../assets/question.svg'
import Container from '../container'
import Input from '../input/input'
import BasicLayout from '../layout/basicLayout'
import './registCard.css'
import CardBox from '../cardBox'
import useInput from '../../hooks/useInput'

type RegisterDataType = {
  cardNumber: string
  expirationDate: string
  ownerName: string
  placeholder?: string
  securityCode: string
  secretCode: string
}

const INITIAL_CARD_STATE: RegisterDataType = {
  cardNumber: '',
  expirationDate: '',
  ownerName: '',
  placeholder: '',
  securityCode: '',
  secretCode: '',
}

type RegistCardProps = {
  onNext?: (data?: any) => void
}

const CARD_NUMBER_LENGTH = 4

/**
 * [리팩토링 요소]
 * 1) 마스킹 넘버 리턴하는것, validation은 받아서 처리하면됨,
 */
const RegistCard = (props: RegistCardProps) => {
  const [registerData, setRegisterData] = useState<RegisterDataType>(
    INITIAL_CARD_STATE,
  )
  // 카드번호 - 3번째
  const [thirdCardMaskedNumber, setThirdCardMaskedNumber] = useState<string>('')
  const [thirdCardNumber, setThirdCardNumber] = useState<string>('')

  // 카드번호 - 4번째
  const [fourthCardMaskedNumber, setFourthCardMaskedNumber] = useState<string>(
    '',
  )
  const [fourthCardNumber, setFourthCardNumber] = useState<string>('')

  // 만료 날짜
  const [expirationDate, setExpirationDate] = useState<string>('')

  // 보안 코드
  const [securityCode, setSecurityCode] = useState<string>('')
  const [securityMaskedCode, setSecurityMaskedCode] = useState<string>('')

  // 비밀 번호
  const [firstSecretCode, setFirstSecretCode] = useState<string>()
  const [firstSecretMaskedCode, setFirstSecretMaskedCode] = useState<string>()

  const [secondSecretCode, setSecondSecretCode] = useState<string>()
  const [secondSecretMaskedCode, setSecondSecretMaskedCode] = useState<string>()

  // 조건에 부합하면 - true리턴 / 조건에 부합하지 않으면 false 리턴
  const validateCardNumber = (value: string, maxLength?: number): boolean => {
    const MAX_LENGTH = maxLength || 4
    const isValidLength = value.length <= MAX_LENGTH
    const isNumber = !Number.isNaN(Number(value))

    const isValid = [isValidLength, isNumber].every(Boolean)

    return isValid
  }

  const isMonth = (input: string) => {
    return new RegExp(/^(0?[1-9]|1[0-2])$/).test(input)
  }

  // 카드 번호
  const {
    value: cardNumberValueFirst,
    handleChange: handleChangeCardNumberFirstFunc,
  } = useInput('')

  const {
    value: cardNumberValueSecond,
    handleChange: handleChangeCardNumberSecondFunc,
  } = useInput('')

  const { value: ownerNameValue, handleChange: handleOwnerNameFunc } = useInput(
    '',
  )

  return (
    <>
      <BasicLayout>
        <BasicLayout.Header>
          <div style={{ display: 'flex' }}>
            <img src={arrow} />
            <h2 className="page-title" style={{ marginLeft: '15px' }}>
              카드 추가
            </h2>
          </div>
        </BasicLayout.Header>
        <BasicLayout.Main>
          <CardBox
            name={ownerNameValue}
            expirationDate={expirationDate}
            cardNumber={`${cardNumberValueFirst}${cardNumberValueSecond}${thirdCardMaskedNumber}${fourthCardMaskedNumber}`}
          />
          <Container title="카드 번호">
            <div className="container-flex">
              <Input
                type="text"
                value={cardNumberValueFirst}
                onChange={(event) => {
                  if (!validateCardNumber(event.target.value, 4)) {
                    return
                  }

                  handleChangeCardNumberFirstFunc(event)
                }}
              />
              {cardNumberValueFirst.length === CARD_NUMBER_LENGTH && (
                <div>-</div>
              )}
              <Input
                type="text"
                value={cardNumberValueSecond}
                onChange={(event) => {
                  if (!validateCardNumber(event.target.value, 4)) {
                    return
                  }

                  handleChangeCardNumberSecondFunc(event)
                }}
              />
              {cardNumberValueSecond.length === CARD_NUMBER_LENGTH && (
                <div>-</div>
              )}

              {/* 실제 값(number by onKeyDown)과 보여지는 값(*)을 분리하자!! */}
              <Input
                type="text"
                value={thirdCardMaskedNumber}
                onChange={(event) => {
                  const newThirdCardNumber =
                    thirdCardNumber + event.target.value.replace(/\*/g, '')

                  if (!validateCardNumber(event.target.value, 4)) {
                    return
                  }

                  setThirdCardNumber(newThirdCardNumber)

                  setThirdCardMaskedNumber(
                    Array.from(event.target.value)
                      .map(() => '*')
                      .join(''),
                  )
                }}
              />
              {thirdCardMaskedNumber.length === CARD_NUMBER_LENGTH && (
                <div>-</div>
              )}

              <Input
                type="text"
                value={fourthCardMaskedNumber}
                onChange={(event) => {
                  const newFourthCardNumber =
                    fourthCardNumber + event.target.value.replace(/\*/g, '')

                  if (!validateCardNumber(event.target.value, 4)) {
                    return
                  }

                  setFourthCardNumber(newFourthCardNumber)

                  setFourthCardMaskedNumber(
                    Array.from(event.target.value)
                      .map(() => '*')
                      .join(''),
                  )
                }}
              />
            </div>
          </Container>
          <Container title="만료일">
            <div className="auto-sizing-width-item-35">
              <Input
                type="text"
                placeholder="MM/YY"
                value={expirationDate}
                onKeyDown={(event) => {
                  if (
                    event.key === 'Backspace' &&
                    expirationDate.includes('/') &&
                    expirationDate.length === 3
                  ) {
                    event.preventDefault()
                    setExpirationDate(
                      expirationDate.slice(0, expirationDate.length - 1),
                    )
                  }
                }}
                onChange={(event) => {
                  const { value } = event.target

                  if (value.length > 5) {
                    return
                  }
                  // 3번째 자리에 /를 삽입
                  if (value.length === 2) {
                    if (!isMonth(value)) {
                      alert(
                        '월은 1이상 12이하 숫자여야 합니다. ex) 3월이라면 03으로 기입해주세요',
                      )
                      return
                    }

                    setExpirationDate(value + '/')
                    return
                  }

                  setExpirationDate(value)
                }}
              />
            </div>
          </Container>
          <Container
            title="카드 소유자 이름(선택)"
            titleRight={<span>{ownerNameValue.length}</span>}
          >
            <Input
              placeholder="카드에 표시된 이름과 동일하게 입력하세요."
              value={ownerNameValue}
              onChange={handleOwnerNameFunc}
            />
          </Container>
          <Container title="보안코드(CVC/CVV)">
            <div className="auto-sizing-width-container">
              <Input
                value={securityMaskedCode}
                onChange={(event) => {
                  const newSecurityCode =
                    securityCode + event.target.value.replace(/\*/g, '')

                  const isValidNumber = (input: string) => {
                    console.log('input', input, !Number.isNaN(Number(input)))
                    return !Number.isNaN(Number(input))
                  }
                  if (!isValidNumber(newSecurityCode)) {
                    alert('숫자를 입력해주세요!')
                    return
                  }
                  setSecurityCode(newSecurityCode)

                  setSecurityMaskedCode(
                    Array.from(event.target.value)
                      .map(() => '*')
                      .join(''),
                  )
                }}
              />
              <button>
                <img src={question} />
              </button>
            </div>
          </Container>
          <Container title="카드비밀번호">
            <div className="auto-sizing-width-container">
              <span className="auto-sizing-width-item">
                <Input
                  value={firstSecretMaskedCode}
                  onChange={(event) => {
                    const newFirstSecretCode =
                      firstSecretCode + event.target.value.replace(/\*/g, '')

                    const isValidNumber = (input: string) => {
                      console.log('input', input, !Number.isNaN(Number(input)))
                      return !Number.isNaN(Number(input))
                    }
                    if (!isValidNumber(newFirstSecretCode)) {
                      alert('숫자를 입력해주세요!')
                      return
                    }
                    setFirstSecretCode(newFirstSecretCode)

                    setFirstSecretMaskedCode(
                      Array.from(event.target.value)
                        .map(() => '*')
                        .join(''),
                    )
                  }}
                />
              </span>
              <span className="auto-sizing-width-item">
                <Input
                  value={secondSecretMaskedCode}
                  onChange={(event) => {
                    const newSecondSecretCode =
                      secondSecretCode + event.target.value.replace(/\*/g, '')

                    if(!validateCardNumber(event.target.value, 1)) {
                      alert('숫자를 입력해주세요!')
                      return
                    }

                    setSecondSecretCode(newSecondSecretCode)

                    setSecondSecretMaskedCode(
                      Array.from(event.target.value)
                        .map(() => '*')
                        .join(''),
                    )
                  }}
                />
              </span>
              <span className="auto-sizing-width-item dot-align">
                <div className="dot-hightlight" />
              </span>
              <span className="auto-sizing-width-item dot-align">
                <div className="dot-hightlight" />
              </span>
            </div>
          </Container>
        </BasicLayout.Main>
        <BasicLayout.Footer className="button-box">
          {/* button - isActive 상태 넣기 */}
          {/* <button
            type="button"
            className="button-text"
            onClick={onClickButtonNextHandler}
          >
            다음
          </button> */}
        </BasicLayout.Footer>
      </BasicLayout>
    </>
  )
}

export default RegistCard