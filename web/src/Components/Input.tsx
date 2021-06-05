import React, { useRef } from "react";
// useField para conectar o input com o unform
import { useField } from "@unform/core";

interface Props {
    name: string
}

type InputProps = JSX.IntrinsicElements["input"] & Props

export default function Input({ name, ...rest }: InputProps) {
    
    // referência do meu input que vai ser alterada na prop ref do input
    const inputRef = useRef(null) 
    const { fieldName, registerField } = useField(name)

    return (
        // aqui a input ref passa a ser meu input, e com isso posso acessar todas as propriedades desse componente
        <input ref={inputRef} {...rest} />
    )
}