---
title: "[J11] Mining and Measuring the Impact of Change Patterns for Improving the Size and Build Time of Docker Images"
collection: publications
category: journals
permalink: /publication/2009-10-01-paper-title-number-1
excerpt: 'Giovanni Rosa, Emanuela Guglielmi, Mattia Iannone, Simone Scalabrino, and Rocco Oliveto'
date: 2025-05-01
venue: Empirical Software Engineering (EMSE - To Appear) 
# slidesurl: 'http://academicpages.github.io/files/slides1.pdf'
paperurl: 'https://giovannirosa.com/assets/pdf/EMSE2025MiningAndMeasuring.pdf'
# bibtexurl: 'http://academicpages.github.io/files/bibtex1.bib'
# citation: 'Your Name, You. (2009). &quot;Paper Title Number 1.&quot; <i>Journal 1</i>. 1(1).'
---
**Abstract.** Software containerization, for which Docker is the reference tool,
is widely adopted in modern software engineering. The performance of the
Docker build process in terms of image size and build time is crucial to developers. While previous work and Docker itself provide best practices to keep
the images small and fast to build, we conjecture that developers might adopt
undocumented practices. In this paper, we present an empirical study in which
we aim (i) to mine the practices adopted by developers for improving the image size and build time, and (ii) to measure the impact of such practices. As
for the mining study, we manually analyzed a total of 1,026 commits from
open-source projects in which developers declared they wanted to improve the
image size or build time. We categorize such changes and define a taxonomy
of 46 optimization strategies, including practices such as removing temporary
files (e.g., package manager cache) or improving the structure of the Dockerfile
(e.g., using multi-stage build). Such a taxonomy reveals some previously un documented techniques, providing valuable insights for developers. As for the
measurement study, we empirically assess the actual improvement in image
size and build time (over 20 builds) of the most frequent change patterns observed in the mining study. Our results show that changing the base image
has the best results in terms of image size, but it negatively affects the build
time. On the other hand, we observed no change pattern that significantly
reduces the build time. Our study provides interesting insights for both tool
makers who want to support practitioners in improving Dockerfile build performance and practitioners themselves, who can better decide how to optimize
their Dockerfiles.