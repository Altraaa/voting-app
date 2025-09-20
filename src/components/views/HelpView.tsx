"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Phone, Mail, Clock, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How do I purchase points for voting?",
    answer:
      "You can purchase points by clicking the 'Buy Points' button in the navbar or visiting the /points page. Choose a point package that suits your needs and make payment through available methods.",
    category: "Point Purchase",
  },
  {
    id: 2,
    question: "Is voting on this platform secure?",
    answer:
      "Yes, our platform uses strong encryption technology and multi-layered security systems to ensure every vote is safe and cannot be manipulated.",
    category: "Security",
  },
  {
    id: 3,
    question: "How can I view voting results?",
    answer:
      "Voting results can be viewed on the category page you selected. Results are displayed in real-time and transparently for all users.",
    category: "Voting Results",
  },
  {
    id: 4,
    question: "Is there a limit on votes per user?",
    answer:
      "Each user can vote as many times as they have points. There are no specific limits, but each vote will deduct points according to the value set for that category.",
    category: "Voting Limits",
  },
  {
    id: 5,
    question: "How do I register as a candidate?",
    answer:
      "To register as a candidate, please contact our admin team through the Contact Us page or our official email. The team will provide complete guidance for the registration process.",
    category: "Candidates",
  },
  {
    id: 6,
    question: "Can purchased points be refunded?",
    answer:
      "Purchased points cannot be refunded in cash. However, unused points can be transferred to other accounts according to applicable terms and conditions.",
    category: "Point Policy",
  },
]

const categories = [
  "All",
  "Point Purchase",
  "Security",
  "Voting Results",
  "Voting Limits",
  "Candidates",
  "Point Policy",
]

export default function HelpView() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [expandedItems, setExpandedItems] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-primary/20 rounded-2xl">
              <HelpCircle className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Help Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
            Find answers to your questions or contact our support team for
            further assistance
          </p>
        </div>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <a
            href="#contact-content"
            className="flex flex-col items-center text-primary hover:text-primary/80 transition-colors"
          >
            <span className="text-sm mb-2">Scroll Down</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </a>
        </div>
      </section>

      <div className="mx-auto px-4 md:px-20 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Search and Filter Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Search Help</CardTitle>
                  <CardDescription>Find answers quickly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                      Categories
                    </h4>
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={
                            selectedCategory === category ? "default" : "ghost"
                          }
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                          className="w-full justify-start text-sm"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Contact Support</CardTitle>
                  <CardDescription>Need direct assistance?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Email</p>
                      <p className="text-sm text-muted-foreground">
                        support@clickvote.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Business Hours</p>
                      <p className="text-sm text-muted-foreground">
                        Mon - Fri: 9:00 AM - 5:00 PM EST
                      </p>
                    </div>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <a href="/contact">Send Message</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-3">
            <Card className="shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl">
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription className="text-base">
                  {filteredFAQs.length} question
                  {filteredFAQs.length !== 1 ? "s" : ""} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 pr-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                              {faq.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-foreground leading-relaxed">
                            {faq.question}
                          </h3>
                        </div>
                        {expandedItems.includes(faq.id) ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </button>
                      {expandedItems.includes(faq.id) && (
                        <div className="px-6 pb-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {filteredFAQs.length === 0 && (
                    <div className="text-center py-12">
                      <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No questions found
                      </h3>
                      <p className="text-muted-foreground">
                        Try changing your search keywords or category filter.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}