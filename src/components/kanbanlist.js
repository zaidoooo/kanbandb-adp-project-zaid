/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import { css, jsx } from '@emotion/react'
// @ts-ignore
import KanbanDB from 'kanbandb';
import AddNewCard from './addnew';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { organizeKanban } from './organizeKanban';
import {v4 as uuidv4} from 'uuid';
import initalData from '../model/initalDS'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import styled from '@emotion/styled';


const CARD_STATUS = {
    'To-do': 'TODO',
    'In Progress': 'IN_PROGRESS',
    'Done': 'DONE',
};
  


function Kanbanlist() {
    const [kanban, setKanban] = useState(initalData);
    const [editMode, setEditMode]= useState({edit: false, id: ''})
    const [description, setDescription] = useState('')

    useEffect(() => {
        KanbanDB.getCardsByStatusCodes(['TODO', 'IN_PROGRESS', 'DONE']).then((data) => {
            let a = organizeKanban(data)
            setKanban(a)
        })
    }, []);

    const onDropEnd = (droppedItem, kanban, setKanban) => {
        if(!droppedItem.destination) return;
        const { source, destination } = droppedItem;
        if(source.droppableId === destination.droppableId){
            const column = kanban[source.droppableId];
            const copiedKanban = [...column.items];
            const [removed] = copiedKanban.splice(source.index, 1)
            copiedKanban.splice(destination.index, 0, removed)
            setKanban({
                ...kanban,
                [source.droppableId]:{
                    ...column,
                    items: copiedKanban
                }
            })
            return
        }
        KanbanDB.getCardById(droppedItem.draggableId).then(card => {
            KanbanDB
            .updateCardById(droppedItem.draggableId, {...card, status: CARD_STATUS[kanban[destination.droppableId].name]})
            .then((data) => {
                if(data){
                   KanbanDB.getCards().then((el) => {
                     let b = organizeKanban(el)
                     setKanban(b)
                   })
                }
            })
        })

    }

    const deleteCard = (id) => {
        KanbanDB.deleteCardById(id).then(el => {
            if(el){
                KanbanDB.getCards().then((el) => {
                    let b = organizeKanban(el)
                    setKanban(b)
                  })
            }
        })
    }
  
    const addNewCard = (data) => {
        if(!data.text) return;
        const newCard = {
            name: data.text,
            status: data.status
        }
        KanbanDB.addCard(newCard).then(el => {
            if(el){
                KanbanDB.getCards().then((el) => {
                    let b = organizeKanban(el)
                    setKanban(b)
                  })
            }
        })
    }

    const updateCard = (id, description) => {
        KanbanDB.updateCardById(id, {description}).then((res) => {
            if(res){
                KanbanDB.getCards().then((el) => {
                    let b = organizeKanban(el)
                    setKanban(b)
                })
                setEditMode({edit: false, id: ''})
            }
        })
    }

    return (
        <div css={{
            display: 'flex',
            justifyContent: 'space-around',
            }}>
            <DragContainer>
                <DragDropContext onDragEnd={(result) => onDropEnd(result, kanban, setKanban)}>
                    {
                        Object.entries(kanban).map(([id, columns]) => {
                            return <Droppable droppableId={id} key={id}>
                                {(provided, snapshot) => {
                                    return (
                                        <div ref={provided.innerRef}
                                            {...provided.droppableProps} style={{paddingTop: 30}}>
                                            <div style={{color: '#0e1991', fontSize: '22px', textAlign: 'center'}}>
                                                {columns.name} 
                                            </div>
                                            {
                                            columns.items !== undefined ? columns.items.map((item, i) => {
                                                    return <Draggable key={item.id} draggableId={item.id} index={i}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                userSelect: "none",
                                                                padding: 12,
                                                                borderRadius: 7,
                                                                margin: '20px auto',
                                                                width: "60%",
                                                                minHeight: 62,
                                                                backgroundColor: 'white',
                                                                color: "#0e6591",
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                ...provided.draggableProps.style
                                                            }}
                                                        >
                                                            <div>{item.name}:</div> 
                                                            {editMode.edit && editMode.id === item.id ? 
                                                            <div>
                                                                <textarea css={css`margin-top: 5px;`} onChange={(e) => setDescription(e.target.value)} defaultValue={item.description}></textarea>
                                                                <div>
                                                                    <button css={css`margin-top: 5px;border:0;border-radius: 8px;padding: 10px;`} onClick={() => updateCard(item.id, description)}>Save</button> 
                                                                    <button css={css`margin-left: 10px; margin-top: 5px;border:0;border-radius: 8px;padding: 10px;`} onClick={() => setEditMode({edit: false, id: ''})}>Cancel</button> 
                                                                </div>
                                                            </div>
                                                            : 
                                                            <div>
                                                                {item.description}
                                                                <div>
                                                                    <FontAwesomeIcon css={css`margin-top: 10px;`} onClick={() => setEditMode({edit: true, id: item.id})} icon={faPencil} />
                                                                    <FontAwesomeIcon css={css`margin-top: 10px; margin-left: 10px;`}  onClick={() => deleteCard(item.id)} icon={faTrashCan} />
                                                                </div>
                                                            </div>}
                                                            
                                                        </div>
                                                    )}
                                                </Draggable>
                                                }) : ''
                                            }
                                            {provided.placeholder}
                                        </div>
                                    )
                                }}
                            </Droppable>
                        })
                    }
                </DragDropContext>
            </DragContainer>
            <AddNewCard addNewCard={addNewCard}/>
        </div>
    );
  }


export default Kanbanlist

const DragContainer = styled.div`
  height: 90%;
  display: flex;
  background-color: #e1e9ed;

  & div, div & {
    width: 100%;
  }

  & > div:first-of-type, & > div:nth-child(2) {
    border-width: 4px;
    border-style: solid;
    border-image: linear-gradient(to top, #0e6591, rgba(0, 0, 0, 0)) 1 100%;
    border-top: 0;
    border-left: 0;
    border-bottom: 0;
  }
}
`