import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { TemplateCard } from "./TemplateCard";
import { templates } from "../data/templates";
import { Search } from "lucide-react";

interface TemplateListProps {
  onSelectTemplate: (id: string) => void;
  language?: 'en' | 'vi' | 'zh';
}

interface TranslationObject {
  en: string;
  vi: string;
  zh: string;
}

export const TemplateList: FC<TemplateListProps> = ({ onSelectTemplate, language = 'en' }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const translations = {
    searchPlaceholder: {
      en: "Search templates...",
      vi: "Tìm kiếm mẫu...",
      zh: "搜索模板..."
    },
    noTemplatesFound: {
      en: "No templates found matching your search",
      vi: "Không tìm thấy mẫu phù hợp với tìm kiếm của bạn",
      zh: "没有找到符合您搜索条件的模板"
    }
  };

  const translatedTemplates = templates.map(template => {
    let translatedTitle: TranslationObject = {
      en: "",
      vi: "",
      zh: ""
    };
    
    if (typeof template.title === 'string') {
      translatedTitle = {
        en: language === 'en' ? template.title : (
          template.title === "邮件数据收集" ? "Email Data Collection" : 
          template.title === "数据归档" ? "Data Archiving" : 
          template.title === "报表自动生成" ? "Automated Report Generation" : 
          template.title === "数据录入自动化" ? "Data Entry Automation" : 
          template.title === "系统错误监控" ? "System Error Monitoring" : 
          template.title === "文档处理自动化" ? "Document Processing Automation" : 
          template.title === "审批流程自动化" ? "Approval Workflow Automation" : 
          template.title === "日历同步与预约管理" ? "Calendar Sync & Appointment Management" : 
          template.title === "发票处理与付款" ? "Invoice Processing & Payment" : 
          template.title === "报表分发自动化" ? "Report Distribution Automation" : 
          template.title === "系统数据同步" ? "System Data Synchronization" : 
          template.title === "合同分析与跟踪" ? "Contract Analysis & Tracking" : 
          template.title
        ),
        vi: language === 'vi' ? template.title : (
          template.title === "邮件数据收集" ? "Thu thập dữ liệu email" : 
          template.title === "数据归档" ? "Lưu trữ dữ liệu" : 
          template.title === "报表自动生成" ? "Tạo báo cáo tự động" : 
          template.title === "数据录入自动化" ? "Tự động hóa nhập liệu" : 
          template.title === "系统错误监控" ? "Giám sát lỗi hệ thống" : 
          template.title === "文档处理自动化" ? "Tự động xử lý tài liệu" : 
          template.title === "审批流程自动化" ? "Tự động hóa quy trình phê duyệt" : 
          template.title === "日历同步与预约管理" ? "Đồng bộ lịch & quản lý cuộc hẹn" : 
          template.title === "发票处理与付款" ? "Xử lý hóa đơn & thanh toán" : 
          template.title === "报表分发自动化" ? "Tự động phân phối báo cáo" : 
          template.title === "系统数据同步" ? "Đồng bộ dữ liệu hệ thống" : 
          template.title === "合同分析与跟踪" ? "Phân tích & theo dõi hợp đồng" : 
          template.title
        ),
        zh: language === 'zh' ? template.title : template.title
      };
    } else if (typeof template.title === 'object' && template.title !== null) {
      translatedTitle = {
        en: (template.title as any).en || "",
        vi: (template.title as any).vi || "",
        zh: (template.title as any).zh || ""
      };
    }
      
    let translatedDescription: TranslationObject = {
      en: "",
      vi: "",
      zh: ""
    };
    
    if (typeof template.description === 'string') {
      translatedDescription = {
        en: language === 'en' ? template.description : (
          template.description === "自动检查收件箱，提取关键数据并汇总到电子表格中" ? "Automatically check inbox, extract key data and summarize in spreadsheet" :
          template.description === "自动将老旧文件归档到指定位置并释放空间" ? "Automatically archive old files to specified location and free up space" :
          template.description === "定期从系统中提取数据并生成标准化报表" ? "Regularly extract data from systems and generate standardized reports" :
          template.description === "将数据从一个系统自动录入到另一个系统" ? "Automatically enter data from one system to another" :
          template.description === "监控系统日志，发现错误时自动通知并生成报告" ? "Monitor system logs, automatically notify and generate reports when errors are found" :
          template.description === "从文档中提取数据，执行验证并生成报告" ? "Extract data from documents, perform validation and generate reports" :
          template.description === "监控审批队列，自动执行标准审批并提醒例外情况" ? "Monitor approval queue, automatically execute standard approvals and alert exceptions" :
          template.description === "在多个日历系统之间同步事件并自动化预约流程" ? "Synchronize events between multiple calendar systems and automate appointment processes" :
          template.description === "自动处理收到的发票，验证信息并准备付款" ? "Automatically process received invoices, verify information and prepare payments" :
          template.description === "定期生成业务报表并分发给相关人员" ? "Regularly generate business reports and distribute to relevant personnel" :
          template.description === "在不同系统之间自动同步核心业务数据" ? "Automatically synchronize core business data between different systems" :
          template.description === "自动提取合同关键条款并监控到期日期" ? "Automatically extract key contract terms and monitor expiration dates" :
          template.description
        ),
        vi: language === 'vi' ? template.description : (
          template.description === "自动检查收件箱，提取关键数据并汇总到电子表格中" ? "Tự động kiểm tra hộp thư đến, trích xuất dữ liệu quan trọng và tổng hợp vào bảng tính" :
          template.description === "自动将老旧文件归档到指定位置并释放空间" ? "Tự động lưu trữ các tệp cũ vào vị trí được chỉ định và giải phóng không gian" :
          template.description === "定期从系统中提取数据并生成标准化报表" ? "Định kỳ trích xuất dữ liệu từ hệ thống và tạo báo cáo chuẩn hóa" :
          template.description === "将数据从一个系统自动录入到另一个系统" ? "Tự động nhập dữ liệu từ một hệ thống sang hệ thống khác" :
          template.description === "监控系统日志，发现错误时自动通知并生成报告" ? "Giám sát nhật ký hệ thống, tự động thông báo và tạo báo cáo khi phát hiện lỗi" :
          template.description === "从文档中提取数据，执行验证并生成报告" ? "Trích xuất dữ liệu từ tài liệu, thực hiện xác thực và tạo báo cáo" :
          template.description === "监控审批队列，自动执行标准审批并提醒例外情况" ? "Giám sát hàng đợi phê duyệt, tự động thực hiện phê duyệt tiêu chuẩn và cảnh báo các trường hợp ngoại lệ" :
          template.description === "在多个日历系统之间同步事件并自动化预约流程" ? "Đồng bộ hóa sự kiện giữa nhiều hệ thống lịch và tự động hóa quy trình hẹn" :
          template.description === "自动处理收到的发票，验证信息并准备付款" ? "Tự động xử lý hóa đơn nhận được, xác minh thông tin và chuẩn bị thanh toán" :
          template.description === "定期生成业务报表并分发给相关人员" ? "Định kỳ tạo báo cáo kinh doanh và phân phối cho nhân viên liên quan" :
          template.description === "在不同系统之间自动同步核心业务数据" ? "Tự động đồng bộ hóa dữ liệu kinh doanh cốt lõi giữa các hệ thống khác nhau" :
          template.description === "自动提取合同关键条款并监控到期日期" ? "Tự động trích xuất các điều khoản chính của hợp đồng và theo dõi ngày hết hạn" :
          template.description
        ),
        zh: language === 'zh' ? template.description : template.description
      };
    } else if (typeof template.description === 'object' && template.description !== null) {
      translatedDescription = {
        en: (template.description as any).en || "",
        vi: (template.description as any).vi || "",
        zh: (template.description as any).zh || ""
      };
    }
      
    let translatedTimeSaved: TranslationObject = {
      en: "",
      vi: "",
      zh: ""
    };
    
    if (typeof template.timeSaved === 'string') {
      translatedTimeSaved = {
        en: language === 'en' ? template.timeSaved : (
          template.timeSaved === "每天省1.5小时" ? "Saves 1.5 hours daily" :
          template.timeSaved === "每月省3小时" ? "Saves 3 hours monthly" :
          template.timeSaved === "每周省4小时" ? "Saves 4 hours weekly" :
          template.timeSaved === "每天省2小时" ? "Saves 2 hours daily" :
          template.timeSaved === "每周省5小时" ? "Saves 5 hours weekly" :
          template.timeSaved === "每天省2.5小时" ? "Saves 2.5 hours daily" :
          template.timeSaved === "每周省6小时" ? "Saves 6 hours weekly" :
          template.timeSaved === "每周省3小时" ? "Saves 3 hours weekly" :
          template.timeSaved === "每月省8小时" ? "Saves 8 hours monthly" :
          template.timeSaved === "每周省2小时" ? "Saves 2 hours weekly" :
          template.timeSaved === "每天省1小时" ? "Saves 1 hour daily" :
          template.timeSaved === "每月省5小时" ? "Saves 5 hours monthly" :
          template.timeSaved
        ),
        vi: language === 'vi' ? template.timeSaved : (
          template.timeSaved === "每天省1.5小时" ? "Tiết kiệm 1.5 giờ mỗi ngày" :
          template.timeSaved === "每月省3小时" ? "Tiết kiệm 3 giờ mỗi tháng" :
          template.timeSaved === "每周省4小时" ? "Tiết kiệm 4 giờ mỗi tuần" :
          template.timeSaved === "每天省2小时" ? "Tiết kiệm 2 giờ mỗi ngày" :
          template.timeSaved === "每周省5小时" ? "Tiết kiệm 5 giờ mỗi tuần" :
          template.timeSaved === "每天省2.5小时" ? "Tiết kiệm 2.5 giờ mỗi ngày" :
          template.timeSaved === "每周省6小时" ? "Tiết kiệm 6 giờ mỗi tuần" :
          template.timeSaved === "每周省3小时" ? "Tiết kiệm 3 giờ mỗi tuần" :
          template.timeSaved === "每月省8小时" ? "Tiết kiệm 8 giờ mỗi tháng" :
          template.timeSaved === "每周省2小时" ? "Tiết kiệm 2 giờ mỗi tuần" :
          template.timeSaved === "每天省1小时" ? "Tiết kiệm 1 giờ mỗi ngày" :
          template.timeSaved === "每月省5小时" ? "Tiết kiệm 5 giờ mỗi tháng" :
          template.timeSaved
        ),
        zh: language === 'zh' ? template.timeSaved : template.timeSaved
      };
    } else if (typeof template.timeSaved === 'object' && template.timeSaved !== null) {
      translatedTimeSaved = {
        en: (template.timeSaved as any).en || "",
        vi: (template.timeSaved as any).vi || "",
        zh: (template.timeSaved as any).zh || ""
      };
    }

    const finalTitle = language === 'zh' ? 
      (typeof template.title === 'string' ? template.title : translatedTitle.zh) :
      (language === 'vi' ? 
        (typeof translatedTitle === 'string' ? translatedTitle : translatedTitle.vi) :
        (typeof translatedTitle === 'string' ? translatedTitle : translatedTitle.en));
    
    const finalDescription = language === 'zh' ? 
      (typeof template.description === 'string' ? template.description : translatedDescription.zh) :
      (language === 'vi' ? 
        (typeof translatedDescription === 'string' ? translatedDescription : translatedDescription.vi) :
        (typeof translatedDescription === 'string' ? translatedDescription : translatedDescription.en));
    
    const finalTimeSaved = language === 'zh' ? 
      (typeof template.timeSaved === 'string' ? template.timeSaved : translatedTimeSaved.zh) :
      (language === 'vi' ? 
        (typeof translatedTimeSaved === 'string' ? translatedTimeSaved : translatedTimeSaved.vi) :
        (typeof translatedTimeSaved === 'string' ? translatedTimeSaved : translatedTimeSaved.en));

    return {
      ...template,
      title: finalTitle,
      description: finalDescription,
      timeSaved: finalTimeSaved,
    };
  });

  const filteredTemplates = translatedTemplates.filter(
    (template) =>
      String(template.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(template.description).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={translations.searchPlaceholder[language]}
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            id={template.id}
            title={template.title}
            description={template.description}
            icon={template.icon}
            timeSaved={template.timeSaved}
            onClick={onSelectTemplate}
          />
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">{translations.noTemplatesFound[language]}</p>
        </div>
      )}
    </div>
  );
};
