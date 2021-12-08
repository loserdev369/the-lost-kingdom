import { Global, css } from "@emotion/react"

export default function GlobalStyles({ children }) {
  return (
    <>
      <Global
        styles={css`
            body {
              background: linear-gradient(180deg, rgba(34,63,43,1) 0%, rgba(73,161,132,1) 50%, rgba(34,63,43,1) 100%);
              position: relative;
            }
            img {
              margin: 0 auto;
            }
            h1, h2, h3, h4, h5, h6 {
              font-family: 'Breathe Fire';
              text-shadow: 15px 15px 20px rgb(0 0 0 / 50%);
            }
            p {
              font-family: 'Timeless';
            }
        `}
      />
      {children}
    </>
  )
}
