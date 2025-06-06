class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :jlx_user, id: false do |t|
      t.string :usr_login, null: false
      t.string :usr_email, null: false
      t.string :usr_password, limit: 120
      t.string :firstname, limit: 100
      t.string :lastname, limit: 100
      t.string :organization, limit: 100
      t.string :phonenumber, limit: 20
      t.string :street, limit: 150
      t.string :postcode, limit: 10
      t.string :city, limit: 150
      t.string :country, limit: 100
      t.text :comment, limit: 300
      t.integer :status
      t.string :keyactivate, limit: 50
      t.datetime :request_date
      t.datetime :create_date
    end
    execute "ALTER TABLE jlx_user ADD PRIMARY KEY (usr_login);"
  end
end
