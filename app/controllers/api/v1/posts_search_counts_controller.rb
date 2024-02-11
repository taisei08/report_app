class Api::V1::PostsSearchCountsController < ApplicationController
  def index
    p params[:q]
    @q = Post.joins(:user)
      .ransack(title_or_description_or_tags_tag_name_or_field_field_name_or_sub_field_field_name_cont: params[:q])
    length = @q.result(distinct: true)
    .count

    render json: { status: 200, length: length}
  end
end
