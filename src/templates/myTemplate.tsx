import { TemplateManagement } from "./components/TemplateManagement";
import { useLanguage } from "@/components/LanguageProvider";


const MyTemplate = () => {
  const { t } = useLanguage();

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("myTemplateTitle")}</h1>
          <p className="text-muted-foreground">{t("myTemplateDescription")}</p>
        </div>

      </div>
      <TemplateManagement />
    </div>
  );
};

export default MyTemplate;
