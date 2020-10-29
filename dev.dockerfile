# Start of install #
FROM ubuntu

# ARGS
ARG git_user
ARG git_pw

# Stop configuring tzdata from coming
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update

# Install git and nodejs
RUN apt-get install -y git nodejs npm

RUN git clone --branch Development https://${git_user}:${git_pw}@github.com/mbruty/COMP2003-2020-O.git

# Move in to the website folder
WORKDIR COMP2003-2020-O/website

RUN touch .env
RUN echo PORT=5000 > .env
# Install the dependencies
RUN npm i

# Start the build
RUN npm run build

# Open the needed ports
EXPOSE 5000:5000

# End of install #
# Run this every time the container is started
CMD ["node", "server.js"]