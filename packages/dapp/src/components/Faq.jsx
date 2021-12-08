import { useRef, useLayoutEffect } from 'react'
import styled from '@emotion/styled'
import { gsap } from 'gsap'

import faqHeading from '../assets/pages/faqs/FAQs.png'
import faq1title from '../assets/pages/faqs/faq1-title.png'
import faq1text from '../assets/pages/faqs/faq-1-text.png'
import faq2title from '../assets/pages/faqs/faq-2-title.png'
import faq2text from '../assets/pages/faqs/faq-2-text.png'
import faq3title from '../assets/pages/faqs/faq-3-title.png'
import faq3text from '../assets/pages/faqs/faq-3-text.png'
import faq4title from '../assets/pages/faqs/faq-4-title.png'
import faq4text from '../assets/pages/faqs/faq-4-text.png'
import faq5title from '../assets/pages/faqs/faq-5-title.png'
import faq5text from '../assets/pages/faqs/faq-5-text.png'
import faq6title from '../assets/pages/faqs/faq-6-title.png'
import faq6text from '../assets/pages/faqs/faq-6-text.png'
import faq7title from '../assets/pages/faqs/faq-7-title.png'
import faq7text from '../assets/pages/faqs/faq-7-text.png'
import faq8title from '../assets/pages/faqs/faq-8-title.png'
import faq8text from '../assets/pages/faqs/faq-8-text.png'
import faq9title from '../assets/pages/faqs/faq-9-title.png'
import faq9text from '../assets/pages/faqs/faq-9-text.png'
import faq10title from '../assets/pages/faqs/faq-10-title.png'
import faq10text from '../assets/pages/faqs/faq-10-text.png'
import faq11title from '../assets/pages/faqs/faq-11-title.png'
import faq11text from '../assets/pages/faqs/faq-11-text.png'
import faq12title from '../assets/pages/faqs/faq-12-title.png'
import faq12text from '../assets/pages/faqs/faq-12-text.png'

const Heading = styled.img`
  margin-top: 6vw;
  @media (max-width: 768px) {
    width: 40vw;
  }
`

const FaqWrapper = styled.div`
  padding: 0 4vw;
`
const Faq = styled.div`
  margin-top: 6vw;
`
const Title = styled.img`
  margin: 2vw 0;
`
const Text = styled.img`
  margin: 0;
  @media (max-width: 768px) {
    width: 100vw;
  }
`

export default function Faqs() {
  const titleRef = useRef()
  const t1 = useRef()

  useLayoutEffect(() => {
    t1.current = gsap.timeline({
      scrollTrigger: {
        trigger: titleRef.current,
        // markers: true,
        toggleActions: 'play none none none',
        start: 'top center',
        ease: 'power1.inOut',
      }
    }).from(titleRef.current, { y: -90, opacity: 0 })

  }, [])

  return (
    <FaqWrapper>
      <Heading ref={titleRef} src={faqHeading} />
      {/* FAQ 1 */}
      <Faq>
        <Title src={faq1title} />
        <Text src={faq1text} />
      </Faq>
      {/* FAQ 2 */}
      <Faq>
        <Title src={faq2title} />
        <Text src={faq2text} />
      </Faq>
      {/* FAQ 3 */}
      <Faq>
        <Title src={faq3title} />
        <Text src={faq3text} />
      </Faq>
      {/* FAQ 4 */}
      <Faq>
        <Title src={faq4title} />
        <Text src={faq4text} />
      </Faq>
      {/* FAQ 5 */}
      <Faq>
        <Title src={faq5title} />
        <Text src={faq5text} />
      </Faq>
      {/* FAQ 6 */}
      <Faq>
        <Title src={faq6title} />
        <Text src={faq6text} />
      </Faq>
      {/* FAQ 7 */}
      <Faq>
        <Title src={faq7title} />
        <Text src={faq7text} />
      </Faq>
      {/* FAQ 8 */}
      <Faq>
        <Title src={faq8title} />
        <Text src={faq8text} />
      </Faq>
      {/* FAQ 9 */}
      <Faq>
        <Title src={faq9title} />
        <Text src={faq9text} />
      </Faq>
      {/* FAQ 10 */}
      <Faq>
        <Title src={faq10title} />
        <Text src={faq10text} />
      </Faq>
      {/* FAQ 11 */}
      <Faq>
        <Title src={faq11title} />
        <Text src={faq11text} />
      </Faq>
      {/* FAQ 12 */}
      <Faq>
        <Title src={faq12title} />
        <Text src={faq12text} />
      </Faq>
    </FaqWrapper>
  )


}
