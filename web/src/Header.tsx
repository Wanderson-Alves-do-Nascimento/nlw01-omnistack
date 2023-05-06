import React from "react";

interface HeaderProps {
  title: string;
}
export function Header(props: HeaderProps) {
  return (
    <header>
      <h1>
        {props.title}
      </h1>
    </header>
  )
}