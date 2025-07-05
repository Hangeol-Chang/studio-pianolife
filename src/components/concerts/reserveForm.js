'use client';
/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useState } from "react";
import { Spacer } from '../common/spacer';

export default function ReserveForm({ concertInfo }) {
    const [reserveSuccess, setReserveSuccess] = useState(false);
    // const [reserveSuccess, setReserveSuccess] = useState(true);
    const [reserveData, setReserveData] = useState({
        name: '',
        email: '',
        contact: '',
        ticketCount: '',
    });

    const PayInfo = styled.div`
        color: #333;
        text-align: flex-start;
        display: flex;
        flex-direction: column;
        background-color: #f9f9f9;
        padding: 20px;
    `;

    const Form = styled.form`
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    `;
    
    const input_style = css`
        padding: 4px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
        &:focus {
            border-color: #007bff;
            outline: none;
        }
        &::placeholder {
            color: #999;
        }
        &:-webkit-autofill {
            -webkit-box-shadow: 0 0 0 30px #fff inset;
            -webkit-text-fill-color: #000;
        }
        &:-webkit-autofill:hover, &:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0 30px #fff inset;
            -webkit-text-fill-color: #000;
        }
    `;

    const ReferenceText = styled.div`
        font-size: 9px;
        color: #666;
        text-align: right;
    `;

    const ViewContainer = ({ k, val }) => {
        return (
            <div css={css`
                display: flex;
                flex-direction: row;
                margin-bottom: 10px;
                width: 100%;
                justify-content: space-between;
                align-items: center;
            `}>
                <label css={css`font-size: 12px;`}> {k} :  </label>
                <span css={css`font-size: 12px;`}> {val} </span>
            </div>
        )
    }

    const InputContainer = ({k, name, hint, req}) => {
        return (
            <div css={css`
                display: flex;
                flex-direction: row;
                margin-bottom: 10px;
                width: 100%;
                justify-content: space-between;
                align-items: center;
            `}>
                <label css={css`font-size: 12px;`}> {k} :  </label>
                <input css={input_style} type="text" name={name} required={req} placeholder={hint} />
            </div>
        )
    }

    const ReserveButton = styled.button`        
        width: 40%;
        margin-left: 60%;

        background-color: white;
        color: black;
        border: 1px solid black;
        border-radius: 2px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 12px;            

        font-weight: light;
        transition: background-color 0.3s ease;
        // margin: auto;
        &:hover {
            background-color: #333333;
            color: white;
        }
        &:active {
            background-color: #555555;
            color: white;
        }
        &:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(50, 50, 50, 0.5);
        }
    }`

    const handleSubmit = async () => {
        const formElement = document.querySelector('form');

        formElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submitted');

            const formData = new FormData(formElement);
            // concertInfo의 title을 form에 추가
            formData.append('concertTitle', concertInfo.title);
            const data = Object.fromEntries(formData.entries());

            // 데이터 정합성 검사.
            if (!data.name || !data.contact || !data.ticketCount) {
                alert('필수 항목을 모두 입력해주세요.');
                return;
            }
            if (isNaN(data.ticketCount) || data.ticketCount <= 0) {
                alert('신청 수량은 1 이상의 숫자로 입력해주세요.');
                return;
            }
            if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                alert('유효한 이메일 주소를 입력해주세요.');
                return;
            }

            // 이메일 전송
            const res = await fetch('/api/sendMail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const fullRes = await res.json();
            if (fullRes.success) {
                setReserveSuccess(true);
                setReserveData(data);
            } else {

            }
        });
    }

    return (
        reserveSuccess ? 
            <PayInfo>
                <div>
                    예약이 완료되었습니다.
                </div>

                <hr css={css`margin: 10px 2px`}/>
                <div css={css`display: flex; justify-content: space-between;`}>
                    <div>예약자 정보</div>
                    <div css={css`min-width: 60%`}>
                        <ViewContainer k={"성함(예약자명)"} val={reserveData.name}/>
                        <ViewContainer k={"연락처"} val={reserveData.contact}/>
                        <ViewContainer k={"신청 수량"} val={reserveData.ticketCount}/>
                        <ViewContainer k={"이메일"} val={reserveData.email}/>
                    </div>
                </div>
                <hr css={css`margin: 10px 2px`}/>

                <Spacer height={10}/>
                <div>
                    예약 정보를 확인하시고, 계좌로 입금 후 기다려주시면
                </div>
                <div>
                    입력해주신 번호를 통해 확인 연락드리겠습니다.
                </div>
                <Spacer height={10}/>

                <hr css={css`margin: 10px 2px`}/>

                <div css={css`display: flex; justify-content: space-between;`}>
                    <div>결제 정보</div>
                    <div css={css`min-width: 80%`}>
                        <ViewContainer k={"입금 계좌"} val={"우리은행 1002-759-062723"}/>
                        <ViewContainer k={"예금주"} val={"고정우"}/>
                        <ViewContainer k={"티켓 가격"} val={reserveData.ticketCount * 10000 + "원. (전석 10,000원)"}/>
                    </div>
                </div>

                <hr css={css`margin: 10px 2px`}/>
                <div css={css`font-size: 12px; color: #666; width: 100%; text-align: right;`}>
                    기타 문의 : jwgo0311@gmail.com
                </div>
            </PayInfo>
        :
        <Form>
            <InputContainer k="성함(예약자명)" name="name" hint="name" req={true}/>
            <InputContainer k="연락처" name="contact" hint="010-XXXX-XXXX" req={true}/>
            <InputContainer k="신청 수량" name="ticketCount" hint="1" req={true}/>

            <ReferenceText>예매 신청 메일을 참조로 보내드립니다.</ReferenceText>
            <InputContainer k="이메일" name="email" hint="studio-pianolife@example.com" req={false}/>

            <ReserveButton type="submit" onClick={() => handleSubmit()}>예매 요청</ReserveButton>
        </Form>
    );
}