/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import { css, jsx } from '@emotion/react'
// @ts-ignore
import KanbanDB from 'kanbandb';
import KanbanItem from './kanbanitem';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { organizeKanban } from './organizeKanban';
import {v4 as uuidv4} from 'uuid';
import initalData from '../model/initalDS'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'


const CARD_STATUS = {
    'To-Do': 'TODO',
    'In Progress': 'IN_PROGRESS',
    'Done': 'DONE',
  };
  


function Kanbanlist() {
    const [kanban, setKanban] = useState(initalData);
    
    useEffect(() => {
        KanbanDB.getCardsByStatusCodes(['TODO', 'IN_PROGRESS', 'DONE']).then((data) => {
            let a = organizeKanban(data)
            setKanban(a)
        })
    }, []);

    const onDropEnd = (droppedItem) => {
        if(!droppedItem.destination) return;
        const { source, destination } = droppedItem;
        const updateCard = KanbanDB.getCardById(droppedItem.draggableId).then(card => {
            KanbanDB
            .updateCardById(droppedItem.draggableId, {...card, status: CARD_STATUS[kanban[destination.droppableId].name]})
            .then((data) => {
                if(data){
                   KanbanDB.getCards().then((el) => {
                     let b = organizeKanban(el)
                     console.log(b)
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
  
    return (
        <div css={{
            backgroundColor: '#e1e9ed',
            display: 'flex',
            justifyContent: 'space-around',
        
            '& div': {
                width: '100%'
            },

            '& > div:first-of-type, & > div:nth-child(2)': {
                borderWidth: 5,
                borderStyle: 'solid',
                borderImage: 'linear-gradient(to top, #0e6591, rgba(0, 0, 0, 0)) 1 100%',
                borderTop: 0,
                borderLeft: 0,
                borderBottom: 0
            }

            }}>
            <DragDropContext onDragEnd={(result) => onDropEnd(result)}>
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
                                                            ...provided.draggableProps.style
                                                        }}
                                                    >
                                                        <div>{item.name}: {item.description}</div>
                                                        <FontAwesomeIcon onClick={() => deleteCard(item.id)} icon={faTrashCan} />
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
                {/* <KanbanItem /> */}
            </DragDropContext>
        </div>
    );
  }


export default Kanbanlist

