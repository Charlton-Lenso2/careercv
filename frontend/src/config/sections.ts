export type FieldType =
  | "text"
  | "multiline"
  | "date"
  | "url"
  | "email"
  | "list"
  | "boolean";

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  keyboard?: "phone-pad";
};

export type SectionConfig = {
  key: string; // matches the API path and the key in the profile response
  label: string;
  singular: string;
  titleKey: string;
  subtitleKey?: string;
  fields: FieldConfig[];
};

export const PERSONAL_FIELDS: FieldConfig[] = [
  { key: "fullName", label: "Full name", type: "text" },
  { key: "headline", label: "Headline", type: "text", placeholder: "e.g. Junior Developer" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "text", keyboard: "phone-pad" },
  { key: "location", label: "Location", type: "text" },
  { key: "summary", label: "Professional summary", type: "multiline" },
];

export const SECTIONS: SectionConfig[] = [
  {
    key: "experiences",
    label: "Experience",
    singular: "Experience",
    titleKey: "jobTitle",
    subtitleKey: "company",
    fields: [
      { key: "jobTitle", label: "Job title", type: "text", required: true },
      { key: "company", label: "Company", type: "text", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "startDate", label: "Start date", type: "date" },
      { key: "endDate", label: "End date", type: "date" },
      { key: "isCurrent", label: "I currently work here", type: "boolean" },
      { key: "description", label: "Description", type: "multiline" },
      { key: "bullets", label: "Key responsibilities / achievements", type: "list" },
    ],
  },
  {
    key: "educations",
    label: "Education",
    singular: "Education",
    titleKey: "qualification",
    subtitleKey: "institution",
    fields: [
      { key: "institution", label: "Institution", type: "text", required: true },
      { key: "qualification", label: "Qualification", type: "text", required: true },
      { key: "fieldOfStudy", label: "Field of study", type: "text" },
      { key: "startDate", label: "Start date", type: "date" },
      { key: "endDate", label: "End date", type: "date" },
      { key: "description", label: "Description", type: "multiline" },
    ],
  },
  {
    key: "skills",
    label: "Skills",
    singular: "Skill",
    titleKey: "name",
    subtitleKey: "category",
    fields: [
      { key: "name", label: "Skill", type: "text", required: true },
      { key: "category", label: "Category", type: "text", placeholder: "e.g. Technical, Communication" },
    ],
  },
  {
    key: "projects",
    label: "Projects",
    singular: "Project",
    titleKey: "name",
    fields: [
      { key: "name", label: "Project name", type: "text", required: true },
      { key: "description", label: "Description", type: "multiline" },
      { key: "url", label: "Link", type: "url" },
      { key: "technologies", label: "Tools / technologies", type: "list" },
      { key: "startDate", label: "Start date", type: "date" },
      { key: "endDate", label: "End date", type: "date" },
    ],
  },
  {
    key: "certifications",
    label: "Certifications",
    singular: "Certification",
    titleKey: "name",
    subtitleKey: "issuer",
    fields: [
      { key: "name", label: "Certification", type: "text", required: true },
      { key: "issuer", label: "Issuer", type: "text" },
      { key: "issueDate", label: "Issue date", type: "date" },
      { key: "expiryDate", label: "Expiry date", type: "date" },
      { key: "credentialUrl", label: "Credential link", type: "url" },
    ],
  },
  {
    key: "achievements",
    label: "Achievements",
    singular: "Achievement",
    titleKey: "title",
    fields: [
      { key: "title", label: "Achievement", type: "text", required: true },
      { key: "description", label: "Description", type: "multiline" },
      { key: "date", label: "Date", type: "date" },
    ],
  },
];

export function findSection(key: string): SectionConfig | undefined {
  return SECTIONS.find((section) => section.key === key);
}