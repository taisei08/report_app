class EmailValidator < ActiveModel::Validator
  def validate(record)
    if record.email.match? URI::MailTo::EMAIL_REGEXP
      return
    else
      raise ActiveRecord::Rollback
      record.errors[:email] << 'has an invalid format'
    end
  end
end