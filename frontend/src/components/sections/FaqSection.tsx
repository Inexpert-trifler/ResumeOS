"use client";

import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeUp } from "@/animations/FadeUp";

const FAQS = [
  {
    question: "How is this different from ChatGPT?",
    answer: "ChatGPT generates generic text based on broad patterns. Our AI Operating System is specifically trained on thousands of successful tech resumes, ATS parsing rules, and recruiter feedback. It doesn't just write; it strategizes, optimizes, and formats perfectly.",
  },
  {
    question: "Will my resume pass the ATS?",
    answer: "Yes. Our templates and the underlying code are built specifically to be parsed flawlessly by major ATS platforms like Workday, Greenhouse, and Lever. We also provide an ATS score before you download.",
  },
  {
    question: "Can I import my existing resume?",
    answer: "Absolutely. You can upload your current PDF or Word document, and our AI will parse it, analyze its weaknesses, and automatically rewrite and reformat it into our premium templates.",
  },
  {
    question: "Do you help with Cover Letters?",
    answer: "Yes! Once your resume is built, you can generate highly targeted cover letters for specific job descriptions with a single click. (Coming Soon)",
  },
  {
    question: "Is my data secure?",
    answer: "We take privacy seriously. Your data is encrypted at rest and in transit. We never sell your personal information to third parties or recruiters without your explicit consent.",
  },
];

export function FaqSection() {
  return (
    <section className="py-24 bg-background">
      <Container>
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Frequently Asked Questions"
            description="Everything you need to know about the product and billing."
            align="center"
            className="mb-12"
          />

          <FadeUp>
            <Accordion className="w-full">
              {FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border/50 px-2">
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
