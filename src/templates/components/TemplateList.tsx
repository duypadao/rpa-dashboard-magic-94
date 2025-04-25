import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { TemplateCard } from "./TemplateCard";
import { Search } from "lucide-react";
import { Template } from "../data/templates";
import { useLanguage } from "@/components/LanguageProvider";

interface TemplateListProps {
  onSelectTemplate: (id: string) => void;
  templates: Template[]
}
export const TemplateList: FC<TemplateListProps> = ({ onSelectTemplate, templates }) => {
  const {t} = useLanguage()
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.filter(z => z.type === "general").map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onClick={onSelectTemplate}
          />
        ))}
      </div>
      <div className="mb-5"></div>
      <h5 className="text-sm text-center pr-10 pl-10">
        {t("templateListDescription1")}
        
        <br/>
        {t("templateListDescription2")}
        
      </h5>
      <div className="mb-5"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.filter(z => z.type === "custom").map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onClick={()=>{}}
          />
        ))}
      </div>
    </div>
  );
};
