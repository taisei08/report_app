# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User

  mount_uploader :image_path, ImageUploader

  has_many :ratings, class_name: "Rating", dependent: :destroy
  has_many :posts, class_name: "Post", dependent: :destroy
  has_many :replies, class_name: "Reply", dependent: :destroy
  has_many :reviews, class_name: "Review", dependent: :destroy
  has_many :ratings, class_name: "Rating", dependent: :destroy
  has_many :fields, through: :interests, class_name: "Field"
  has_many :interests, class_name: "Interest", dependent: :destroy
end
