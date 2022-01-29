import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router';
import {ButtonSendSticker } from '../src/componentes/ButtonSendSticker'

import React from 'react';
import appConfig from '../config.json';

const supabase = createClient('https://bpcypqckhlvxdckfimul.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM4ODI2NSwiZXhwIjoxOTU4OTY0MjY1fQ.QwYeBZkludsgltUsKwjmgJIlF8-q5ZpUbzDThuwIn2k')

function atualizaMensagens(addMensagem) {
    return supabase
        .from('chat')
        .on('INSERT', (dado) =>{
            addMensagem(dado.new);
        })
        .subscribe();
}


export default function ChatPage() {  

    const [dadoMensagem, setDadoMensagem] = React.useState('');
    const [listaDadoMensagem, setListaDadoMensagem] = React.useState([]);
    const rotear = useRouter();


    React.useEffect(() =>{
        supabase
            .from('chat')
            .select('*')
            .order('id', {ascending: false})
            .then(({data}) =>{
               setListaDadoMensagem(data);
            });

            atualizaMensagens((dadoMsd) =>{             
                setListaDadoMensagem((valores) =>{
                    return[
                        dadoMsd,
                        ...valores,
                    ]
                });
            });
    }, []);


    function novaMensagem(mensagemNova) {
        const mensagem = {
            autor: rotear.query.user,
            conteudo: mensagemNova
        };

        supabase
            .from('chat')
            .insert([
                mensagem
            ])
            .then(({data}) =>{
                console.log('Nova mensagem:', data);
            })
        setDadoMensagem('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.neutrals['500'],
                backgroundImage: 'url(https://cdn2.hubspot.net/hubfs/3350762/Top%20Cybersecurity%20Zoom%20Backgrounds-4.png)',
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '85%',
                    maxWidth: '75%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaDadoMensagem} />
                    {/* {listaDadoMensagem.map((valor)=>{
                        return (
                            <ul key={valor.id}>
                                <li>data: {valor.data}</li>
                                <li>{valor.autor}: {valor.texto} </li>
                            </ul>
                        )
                    })} */}


                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={dadoMensagem}
                            onChange={(event) => {
                                setDadoMensagem(event.target.value);
                            }}
                            onKeyPress={(event) => {
                                if (event.key == 'Enter') {
                                    event.preventDefault();
                                    novaMensagem(dadoMensagem)
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                novaMensagem(':sticker: '+sticker);
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    const mensagem = props.mensagens;
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {mensagem.map((msg) => {
                return (
                    <Text
                        key={msg.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${msg.autor}.png`}
                            />
                            <Text tag="strong">
                                {msg.autor}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {msg.datem}
                            </Text>
                        </Box>
                        {msg.conteudo.startsWith(':sticker:') 
                        ? (
                            <Image src={msg.conteudo.replace(':sticker:', '')}/>
                        )
                        : (
                            msg.conteudo
                        )}
                    </Text>
                )
            })}
        </Box>
    )
}