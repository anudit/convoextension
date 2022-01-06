import React, { useEffect, useState, useContext, useRef } from 'react';
import styled from 'styled-components';
import { Flex, NeuButton, NeuIconButton } from '../../../components/Base';
import { MenuIcon, SendIcon } from '../../../components/Icons';
import { Web3Context } from '../../../contexts/Web3Context';
import TabShell from '../../../components/TabShell';
import MessagesRenderer from '../../../components/MessagesRenderer';

const MessageAuthor = styled.p`
  font-size: 1em;
  padding-bottom: 0px;
  padding-top: 0px;
  margin-bottom: 0px;
  margin-top: 0px;
  text-align: ${props => props.align ? props.align : "left"};
`;

const MessageText = styled.p`
  font-size: 1.2em;
  font-weight: 600;
  padding-bottom: 0px;
  padding-top: 0px;
  margin-bottom: 0px;
  margin-top: 0px;
  text-align: ${props => props.align ? props.align : "left"};
`;

const Bubble = styled(Flex)`
  border-radius: 10px;
  width: 70%;
  word-break: break-word;
  margin-bottom:10px;
  padding: 8px;
  background-color: ${props => props.type === 0 ? "#ffffff70" : "#4c4cff3b"};
`;

const MessageRow = styled(Flex)`
  width: 96%;
  display:flex;
  margin-right:5px;
  margin-left:5px;
  flex-direction: ${props => props.type === 0 ? "row" : "row-reverse"};
`;

const MessageBox = styled.input`
    width: 100%;
    margin: 4px;
    border-radius: 5px;
    border: none;
    height: 40px;
    color: text;
`;

const LoginButton = styled.button`
    min-width:100%;
    height: 50px !important;
    display:flex;
    align-items: center;
    justify-content: center;
    background: #ffffff70;
    border-bottom-left-radius: 20px;
    border:none;
    padding:8px;
`;


function PublicTab({ setTabIndex }) {

    const { signerAddress, convo, getAuthToken } = useContext(Web3Context);
    let [comments, setComments] = useState(undefined);
    const newMessageRef = useRef(null);

    useEffect(async () => {
        // let url = document.location.origin + document.location.pathname;
        // let threadId = "public";
        let url = 'https://theconvo.space/';
        let threadId = "KIGZUnR4RzXDFheXoOwo";
        let snapshot = await convo.comments.query({
            url: encodeURIComponent(url),
            threadId,
            latestFirst: true
        });
        setComments(snapshot.reverse());

        let commentsBox = document.getElementById('commentsBox');
        if (Boolean(commentsBox) === true) {
            const scroll = commentsBox.scrollHeight - commentsBox.clientHeight;
            commentsBox.scrollTo(0, scroll);
        }
    }, []);

    async function scrollDown() {
        let commentsBox = document.getElementById('commentsBox');
        if (Boolean(commentsBox) === true) {
            const scroll = commentsBox.scrollHeight - commentsBox.clientHeight;
            commentsBox.scrollTo(0, scroll);
            console.log('scrolled');
        }
    }

    useEffect(async () => {
        setTimeout(scrollDown, 2000)
    }, [comments]);


    async function sendMessage() {

        let token = await getAuthToken();
        let url = 'https://theconvo.space/';
        let threadId = "KIGZUnR4RzXDFheXoOwo";

        console.log({
            signerAddress,
            token,
            comment: encodeURIComponent(newMessageRef.current.value),
            threadId,
            url
        })
        let resp = await convo.comments.create(
            signerAddress,
            token,
            encodeURIComponent(newMessageRef.current.value),
            threadId,
            url
        );
        console.log(resp);
        setComments((currentComments) => {
            let updatedComments = currentComments.concat([resp]);
            console.log(updatedComments);
            return updatedComments;
        })
    }

    if (comments === undefined) {
        return (
            <TabShell>
                <Flex width="100%" height="450px" display="flex" justifyContent="center" alignContent="center">
                    <div className="loader"></div>
                </Flex>
            </TabShell>
        );
    }
    else if (Boolean(comments) === true && comments.length === 0 && Boolean(comments.map) === false) {
        return (<TabShell> No comments </TabShell>);
    }
    else {
        return (
            <TabShell>
                <Flex height="450px" display="flex" flexDirection="column" overflow="scroll" className="publicTab" id="commentsBox">
                    <MessagesRenderer comments={comments} />
                </Flex>
                {
                    signerAddress !== "" ? (
                        <Flex height="50px" display="flex" flexDirection="row" alignItems="center">
                            <NeuIconButton>
                                <MenuIcon width="30px" height="30px" />
                            </NeuIconButton>
                            <MessageBox type="text" ref={newMessageRef} />
                            <NeuIconButton onClick={sendMessage}>
                                <SendIcon width="15px" height="15px" />
                            </NeuIconButton>
                        </Flex>
                    ) : (
                        <Flex height="50px" display="flex" flexDirection="row" >
                            <NeuButton onClick={() => { setTabIndex(2) }} width="100%" m="5px">
                                Login
                            </NeuButton>
                        </Flex>
                    )
                }
            </TabShell>
        );
    }
}

export default PublicTab;
