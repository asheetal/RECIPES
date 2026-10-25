FROM rocker/verse:4.3.3
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-latex-recommended \
    texlive-fonts-extra \
    lmodern \
 && rm -rf /var/lib/apt/lists/*
COPY runner-server.py /app/asp-feature/runner-server.py
COPY scripts /app/asp-feature/scripts
EXPOSE 8091
CMD ["python3", "/app/asp-feature/runner-server.py"]
