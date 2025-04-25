import { useLanguage } from "@/components/LanguageProvider";


const FinalStep = ({template}) => {
  const { t } = useLanguage();

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("myTemplateTitle")}</h1>
          <p className="text-muted-foreground">{t("myTemplateDescription")}</p>
        </div>

      </div>
    </div>
  );
};

export default FinalStep;
