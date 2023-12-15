FROM plaidinc/pattern-ngrok:1.0.7

RUN set -x \
    && apk add --no-cache curl \
    && curl -Lo /ngrok.zip https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip \
    && unzip -o /ngrok.zip -d /bin \
    && rm -f /ngrok.zip \
    && adduser -h /home/ngrok -D -u 6737 ngrok
