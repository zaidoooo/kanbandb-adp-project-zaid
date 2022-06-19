import React, { useState, useEffect } from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import styled from '@emotion/styled';

function AddNewCard(props) {
    const [text, setText]=useState('')
    const [status, setStatus]=useState('TODO')

    return (
        <Container>
            <input type="text" placeholder='e.g Bug: TextPoll not dispatching half stars' value={text}
                    onChange={e => setText(e.target.value)}/>
            <select // @ts-ignore
                    css={css` margin-left: 10px; padding: 12px; border-radius: 8px;`} onChange={e => setStatus(e.target.value)} value={status}>
                <option value="TODO">To-do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
            </select>
            <button onClick={() => props.addNewCard({text, status},setText(''))}>Add Card</button>
        </Container>
    )
  }

  const Container = styled.div`
    display: flex;
    position: absolute;
    margin: 0 auto;
    bottom: 75px;
    background: white;
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 30px;
    height: 80px;
    box-shadow: 5px 5px 15px 0px #9C9C9C;

    & input[type="text"] {
        background-color: #f3f3f3;
        padding: 12px;
        border-radius: 8px;
        width: 80%;
        border: 0;
    }

    & button {
        padding: 12px;
        border-radius: 8px;
        border: 0;
        width: 15%;
        background-color: #51bb51;
        color: white;
        text-transform: uppercase;
        font-size: 16px;
        font-weight: bold;
        margin-left: 10px;
    }
  `


export default AddNewCard
