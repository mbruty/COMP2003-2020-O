FROM ubuntu

ARG git_user
ARG git_pw

# Stop configuring tzdata from coming
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update

# Install wget

RUN  apt-get update \
  && apt-get install -y wget \
  && rm -rf /var/lib/apt/lists/*

# Install git
RUN apt-get update && apt-get install -y git

# Install dotnet
RUN wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
RUN dpkg -i packages-microsoft-prod.deb
RUN apt-get update; \
  apt-get install -y apt-transport-https && \
  apt-get update && \
  apt-get install -y dotnet-sdk-3.1

RUN git clone clone --branch Development https://${git_user}:${git_pw}@github.com/mbruty/COMP2003-2020-O.git

# Move in to the website folder
WORKDIR COMP2003-2020-O/api


# Open the needed ports
EXPOSE 445:445

# End of install #