"use client";

import { Container } from "@/components/shared/Container";
import { FadeUp } from "@/animations/FadeUp";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Do ATS systems reject two-column resumes?",
    answer: "Generally, yes. Older Applicant Tracking Systems read strictly left-to-right, top-to-bottom. If you have a two-column layout, the ATS might read your 'Skills' column spliced directly into your 'Experience' column, creating gibberish. Stick to single-column for corporate roles.",
  },
  {
    question: "Should I use a creative template for tech jobs?",
    answer: "No. Software Engineering, Data Science, and IT roles prefer clean, traditional, single-column templates. The only roles that benefit from creative templates are UI/UX Design, Graphic Design, and some Marketing positions.",
  },
  {
    question: "Can I download these templates for Word or Google Docs?",
    answer: "Yes, our builder allows you to export your final resume as a PDF (recommended for applications) or as a DOCX file if a recruiter specifically requests it.",
  },
  {
    question: "How do I know if my resume is too long?",
    answer: "If you have less than 7 years of experience, it must be 1 page. If you have 7-15 years, you can use 2 pages, but only if every single bullet point is highly relevant. Fluff will get you rejected.",
  },
];

export function TemplateFaqSection() {
  return (
    <section className="py-24 border-t border-border/50">
      <Container>
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Frequently Asked Questions
              </h2>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <Accordion className="w-full">
              {FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border/50 bg-card rounded-xl mb-4 shadow-sm border px-4">
                  <AccordionTrigger className="text-left text-lg hover:text-accent hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
