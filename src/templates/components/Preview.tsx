import { useLanguage } from "@/components/LanguageProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

const Preview = ({ template }) => {
  const { t } = useLanguage();

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        {template.preview ? (
          <Tabs defaultValue={Object.keys(template.preview)[0]}>
            <TabsList className="mb-6">
              {Object.entries(template.preview).map(([k, v]) => <TabsTrigger key={`tab${k}`} value={k}>{t(k)}</TabsTrigger>)}
            </TabsList>

            {Object.entries(template.preview).map(([k, v]) => <TabsContent  key={`tabContent${k}`} value={k}><div>{v as ReactNode}</div></TabsContent>)}
          </Tabs>
        ) : (
          <div className="w-50 h-50 text-center ">
            <h1 className="text-xl font-semibold"> {t("templateHasNoPreview")}</h1>
          </div>
        )}

      </div>
    </div>
  );
};

export default Preview;
