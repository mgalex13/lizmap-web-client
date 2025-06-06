class User < ApplicationRecord
  self.table_name = 'jlx_user'
  self.primary_key = 'usr_login'

  scope :find_all, -> { order(:usr_login) }
  scope :find_by_login, ->(pattern) { where('usr_login LIKE ?', pattern).order(:usr_login) }

  def self.get_by_login_password(login, password)
    find_by(usr_login: login, usr_password: password)
  end

  def self.get_by_login(login)
    find_by(usr_login: login)
  end

  def self.get_by_login_or_email(login)
    where('usr_login = :login OR usr_email = :login', login: login).first
  end

  def self.get_by_email(email)
    where(usr_email: email)
  end

  def update_password(password)
    update(usr_password: password)
  end

  def self.delete_by_login(login)
    where(usr_login: login).destroy_all
  end
end
