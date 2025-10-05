"use client";

import type React from "react";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Users,
  Headphones,
  Globe,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "general",
    });

    setIsSubmitting(false);
    alert(
      "Your message has been sent successfully! Our team will contact you soon."
    );
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      description: "Send email for general inquiries",
      value: "seraphicvsl@gmail.com",
      action: "mailto:seraphicvsl@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      description: "Call for direct assistance",
      value: "+6288219320121",
      action: "tel:+6288219320121",
    },
    {
      icon: MapPin,
      title: "Address",
      description: "Our headquarters",
      value:
        "Kedundung Sari Street, No. 1 Ubung Kaja 80116 North Denpasar, Bali, Indonesia",
      action: "#",
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "Customer service hours",
      value: "Monday - Friday: 9:00 AM - 5:00 PM EST",
      action: "#",
    },
  ];

  const supportCategories = [
    { value: "general", label: "General Questions" },
    { value: "technical", label: "Technical Issues" },
    { value: "billing", label: "Billing & Payments" },
    { value: "partnership", label: "Partnership" },
    { value: "feedback", label: "Feedback & Suggestions" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-primary/20 rounded-2xl">
              <MessageCircle className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
            Have questions or need help? Our customer service team is ready to
            assist you 24/7
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

      <div id="contact-content" className="mx-auto md:px-20 px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Information Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="text-xl">Contact Information</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Multiple ways to reach us
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {info.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {info.description}
                      </p>
                      <a
                        href={info.action}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        {info.value}
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Support */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <Headphones className="h-6 w-6 text-primary" />
                  <span className="text-xl">Quick Support</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Need immediate help?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  size="lg"
                  asChild
                >
                  <a href="/help" className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>View FAQ</span>
                  </a>
                </Button>
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  size="lg"
                  asChild
                >
                  <a
                    href="https://wa.me/6288219320121"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp Chat</span>
                  </a>
                </Button>
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  size="lg"
                  asChild
                >
                  <a
                    href="mailto:seraphicvsl@gmail.com"
                    className="flex items-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email Support</span>
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card className="shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl">Send Message</CardTitle>
                <CardDescription className="text-base">
                  Fill out the form below and our team will respond promptly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold">
                      Category
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: val,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full h-11">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportCategories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-semibold">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enter message subject"
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write your message here..."
                      rows={6}
                      required
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-3" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="mt-8 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Zap className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">
                        Response Time
                      </h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Email: 1-2 business hours</li>
                      <li>• Phone: Immediate</li>
                      <li>• WhatsApp: 15-30 minutes</li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Globe className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">
                        Languages
                      </h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• English</li>
                      <li>• Spanish</li>
                      <li>• French</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
