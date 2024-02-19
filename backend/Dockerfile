FROM ruby:3.2.2

WORKDIR /backend

COPY Gemfile /backend
COPY Gemfile.lock /backend
RUN bundle install
COPY . /backend

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3010

CMD ["rails", "server", "-b", "0.0.0.0"]
