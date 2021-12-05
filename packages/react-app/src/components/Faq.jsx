import React from 'react'
import styled from '@emotion/styled'
import faqHeading from '../assets/pages/faqs/FAQs.png'

const Heading = styled.img`
  margin-top: 6vw;
`

export default function Faq() {
  return <Heading src={faqHeading} />
}
