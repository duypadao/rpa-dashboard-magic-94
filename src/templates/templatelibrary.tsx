import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplateList } from "./components/TemplateList";
import { ParameterForm } from "./components/ParameterForm";
import { TemplateManagement } from "./components/TemplateManagement";
import { useToast } from "@/components/ui/use-toast";
import { FolderPlus, Zap, LayoutDashboard } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { templates } from "./data/templates";


const RPATemplateLibrary = () => {
  const { t } = useLanguage();
  const [currentTab, setCurrentTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
  };

  const handleBack = () => {
    setSelectedTemplate(null);
  };

  const handleGenerateRPA = (parameters: Record<string, string>) => {
    console.log("Creating RPA with parameters:", parameters);

    toast({
      title: t("rpaTemplateCreated"),
      description: t("rpaTemplateCreatedDescription"),
    });

    setSelectedTemplate(null);
    setCurrentTab("management");
  };

  const handlePreviewRPA = (parameters: Record<string, string>) => {
    toast({
      title: t("previewMode"),
      description: t("previewDesc"),
    });
  };

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("templateLibrary")}</h1>
          <p className="text-muted-foreground">{t("templateLibraryDescription")}</p>
        </div>

        {/* <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button onClick={() => setCurrentTab("templates")}>
            <FolderPlus className="mr-2 h-4 w-4" />
            {t("createTemplateButton")}
          </Button>
        </div> */}
      </div>
      {selectedTemplate ? (
        <ParameterForm
          templateId={selectedTemplate}
          onBack={handleBack}
          onGenerate={handleGenerateRPA}
          onPreview={handlePreviewRPA}
        />
      ) : (
        <TemplateList onSelectTemplate={handleSelectTemplate} templates={templates} />
      )}

    </div>
  );
};

export default RPATemplateLibrary;
