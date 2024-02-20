class CreateFieldsRecords < ActiveRecord::Migration[7.0]
  def change
    fields_data = [
      { field_id: 1, field_name: "社会科学全般" },
      { field_id: 2, field_name: "法学" },
      { field_id: 3, field_name: "政治学" },
      { field_id: 4, field_name: "社会学" },
      { field_id: 5, field_name: "経済学" },
      { field_id: 6, field_name: "経営学" },
      { field_id: 7, field_name: "商学" },
      { field_id: 8, field_name: "人文科学全般" },
      { field_id: 9, field_name: "日本文学" },
      { field_id: 10, field_name: "外国文学" },
      { field_id: 11, field_name: "言語学" },
      { field_id: 12, field_name: "歴史学" },
      { field_id: 13, field_name: "地理学" },
      { field_id: 14, field_name: "心理学" },
      { field_id: 15, field_name: "哲学" },
      { field_id: 16, field_name: "芸術全般" },
      { field_id: 17, field_name: "音楽" },
      { field_id: 18, field_name: "美術" },
      { field_id: 19, field_name: "医学" },
      { field_id: 20, field_name: "獣医学" },
      { field_id: 21, field_name: "薬学" },
      { field_id: 22, field_name: "理学全般" },
      { field_id: 23, field_name: "生物学" },
      { field_id: 24, field_name: "農学" },
      { field_id: 25, field_name: "物理学" },
      { field_id: 26, field_name: "数学" },
      { field_id: 27, field_name: "化学" },
      { field_id: 28, field_name: "工学全般" },
      { field_id: 29, field_name: "機械工学" },
      { field_id: 30, field_name: "電気電子工学" },
      { field_id: 31, field_name: "土木建築工学" },
      { field_id: 32, field_name: "情報工学" },
      { field_id: 33, field_name: "その他" }
    ]
    fields_data.each do |data|
      Field.create!(data)
    end
  end
end
