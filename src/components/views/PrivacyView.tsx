"use client";

import type React from "react";

import { useState } from "react";
import {
  Shield,
  Eye,
  Lock,
  Database,
  Users,
  Globe,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PrivacySection {
  id: string;
  title: string;
  icon: LucideIcon;
  content: string[];
}

const privacySections: PrivacySection[] = [
  {
    id: "introduction",
    title: "Introduction",
    icon: FileText,
    content: [
      "Welcome to Click Vote. We are committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, store, and protect your information when you use our voting platform.",
      "By using Click Vote services, you agree to the collection and use of information in accordance with this policy. If you do not agree with this policy, please do not use our services.",
    ],
  },
  {
    id: "data-collection",
    title: "Information We Collect",
    icon: Database,
    content: [
      "Personal Information: Full name, email address, phone number, and other identity information you provide during registration.",
      "Account Information: Username, password (encrypted), account preferences, and your activity history on the platform.",
      "Voting Information: Voting data you perform, including categories, selected candidates, and voting time.",
      "Transaction Information: Point purchase details, payment methods, and transaction history.",
      "Technical Information: IP address, browser type, operating system, and platform usage data for analysis and security purposes.",
    ],
  },
  {
    id: "data-usage",
    title: "How We Use Information",
    icon: Eye,
    content: [
      "Provide and maintain secure and transparent voting services.",
      "Process point purchase transactions and manage user accounts.",
      "Send important notifications related to services and policy changes.",
      "Analyze platform usage to improve user experience.",
      "Prevent fraud and ensure platform security.",
      "Comply with legal obligations and applicable regulations.",
    ],
  },
  {
    id: "data-protection",
    title: "Data Protection",
    icon: Lock,
    content: [
      "SSL/TLS encryption for all data transmissions.",
      "Secure data storage with enterprise-level encryption.",
      "Limited access only to authorized personnel.",
      "24/7 security monitoring to detect threats.",
      "Regular data backups with additional encryption.",
      "Periodic security audits by independent third parties.",
    ],
  },
  {
    id: "data-sharing",
    title: "Information Sharing",
    icon: Users,
    content: [
      "We do not sell, rent, or share your personal information with third parties without explicit consent.",
      "Information may be shared with trusted service providers who assist in platform operations (under strict confidentiality agreements).",
      "Information may be disclosed if required by law or to protect the rights and security of other users.",
      "Aggregated and anonymous data may be used for research and platform development purposes.",
    ],
  },
  {
    id: "user-rights",
    title: "Your Rights",
    icon: Shield,
    content: [
      "Access: You have the right to access personal information we store about you.",
      "Correction: You can update or correct inaccurate information.",
      "Deletion: You can request deletion of your account and personal data.",
      "Portability: You can request a copy of your data in a readable format.",
      "Objection: You can object to data processing for certain purposes.",
      "Complaints: You can file complaints with competent data protection authorities.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and Tracking Technologies",
    icon: Globe,
    content: [
      "We use cookies to enhance user experience and analyze platform usage.",
      "Essential cookies are required for basic platform functions and cannot be disabled.",
      "Analytics cookies help us understand how users interact with the platform.",
      "Preference cookies remember user choices and settings.",
      "You can manage cookie preferences through your browser settings.",
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    icon: Database,
    content: [
      "Personal data will be stored while your account is active and necessary to provide services.",
      "Transaction data will be stored in accordance with legal obligations and financial regulations.",
      "Voting data will be stored to ensure transparency and audit trails.",
      "Data that is no longer needed will be securely deleted after the established retention period.",
      "Backup data will be deleted periodically according to the established retention schedule.",
    ],
  },
  {
    id: "updates",
    title: "Policy Changes",
    icon: Calendar,
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons.",
      "Material changes will be communicated via email or platform notifications.",
      "Continued use of the platform after policy changes is considered acceptance of those changes.",
      "The latest version of the policy will always be available on this page with a clear effective date.",
    ],
  },
];

export default function PrivacyView() {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "introduction",
  ]);
  const [activeSection, setActiveSection] = useState<string>("introduction");

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const expandAll = () => {
    setExpandedSections(privacySections.map((section) => section.id));
  };

  const collapseAll = () => {
    setExpandedSections([]);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-primary/20 rounded-2xl">
              <Shield className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty mb-8">
            Our commitment to protecting your privacy and personal data security
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={expandAll} variant="outline" size="lg">
              Expand All
            </Button>
            <Button onClick={collapseAll} variant="outline" size="lg">
              Collapse All
            </Button>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <a
            href="#privacy-content"
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

      <div id="privacy-content" className="mx-auto px-4 md:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Navigation</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <nav className="space-y-1">
                      {privacySections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-primary/5 flex items-center space-x-3 ${
                            activeSection === section.id
                              ? "bg-primary/10 text-primary border-r-2 border-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          <section.icon className="h-4 w-4" />
                          <span>{section.title}</span>
                        </button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Last Updated */}
              <Card className="mb-8 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">
                      Last updated: December 20, 2024
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {privacySections.map((section, index) => (
                  <Card
                    key={section.id}
                    id={section.id}
                    className={`shadow-sm ${
                      section.id === "introduction" ||
                      index === privacySections.length - 1
                        ? "xl:col-span-2"
                        : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-primary/10 rounded-xl">
                            <section.icon className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-xl font-semibold">
                            {section.title}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSection(section.id)}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-sm">
                            {expandedSections.includes(section.id)
                              ? "Collapse"
                              : "Expand"}
                          </span>
                          {expandedSections.includes(section.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    {expandedSections.includes(section.id) && (
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {section.content.map((paragraph, index) => (
                            <p
                              key={index}
                              className="text-muted-foreground leading-relaxed"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>

              {/* Contact Information */}
              <Card className="mt-12 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Contact Us</CardTitle>
                  <CardDescription className="text-base">
                    If you have questions about this Privacy Policy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">
                        Email
                      </h4>
                      <p className="text-muted-foreground">
                        seraphicvsl@gmail.com
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">
                        Address
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Kedundung Sari Street
                        <br />
                        No. 1 Ubung Kaja 80116 North Denpasar, Bali
                        <br />
                        Indonesia
                      </p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Button size="lg" asChild>
                      <a href="/contact">Send Question</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
