
export interface Template {
  id: string;
  name: {
    en: string;
    vi: string;
    zh: string;
  };
  status: {
    en: string;
    vi: string;
    zh: string;
  };
  executionCount: number;
  successRate: number;
  lastRun: {
    en: string;
    vi: string;
    zh: string;
  };
  active: boolean;
}

export const myTemplates: Template[] = [
  {
    id: "1",
    name: {
      en: "Daily Sales Report Generation",
      vi: "Tạo Báo Cáo Bán Hàng Hàng Ngày",
      zh: "每日销售报表自动生成"
    },
    status: {
      en: "Success",
      vi: "Thành công",
      zh: "成功"
    },
    executionCount: 42,
    successRate: 98,
    lastRun: {
      en: "Today 08:30",
      vi: "Hôm nay 08:30",
      zh: "今天 08:30"
    },
    active: true
  },
  {
    id: "2",
    name: {
      en: "Customer Order Data Sync",
      vi: "Đồng Bộ Dữ Liệu Đơn Hàng",
      zh: "客户订单数据同步"
    },
    status: {
      en: "Running",
      vi: "Đang chạy",
      zh: "运行中"
    },
    executionCount: 78,
    successRate: 94,
    lastRun: {
      en: "Running",
      vi: "Đang chạy",
      zh: "正在运行"
    },
    active: true
  },
  {
    id: "3",
    name: {
      en: "Invoice Auto Processing",
      vi: "Xử Lý Hóa Đơn Tự Động",
      zh: "发票自动处理"
    },
    status: {
      en: "Failed",
      vi: "Thất bại",
      zh: "失败"
    },
    executionCount: 15,
    successRate: 60,
    lastRun: {
      en: "Yesterday 16:45",
      vi: "Hôm qua 16:45",
      zh: "昨天 16:45"
    },
    active: false
  },
  {
    id: "4", 
    name: {
      en: "System Log Error Monitoring",
      vi: "Giám Sát Lỗi Nhật Ký Hệ Thống",
      zh: "系统日志错误监控"
    },
    status: {
      en: "Success",
      vi: "Thành công", 
      zh: "成功"
    },
    executionCount: 36,
    successRate: 100,
    lastRun: {
      en: "Today 06:00",
      vi: "Hôm nay 06:00",
      zh: "今天 06:00"
    },
    active: true
  },
  {
    id: "5",
    name: {
      en: "Old File Auto Archive",
      vi: "Lưu Trữ Tập Tin Cũ Tự Động",
      zh: "旧文件自动归档"
    },
    status: {
      en: "Success",
      vi: "Thành công",
      zh: "成功"
    },
    executionCount: 15,
    successRate: 100,
    lastRun: {
      en: "3 days ago",
      vi: "3 ngày trước",
      zh: "3天前"
    },
    active: true
  }
];

