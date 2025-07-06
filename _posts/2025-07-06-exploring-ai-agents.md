---
title: 'Exploring AI Agents with OCI Generative AI Agents Platform'
date: 2199-07-06
permalink: /posts/2025/exploring-ai-agents-oci
tags:
  - oracle-generative-ai
  - ai-agents
  - rag
  - english
excerpt: 'An _AI Agent_ is an intelligent systems capable of autonomously performing tasks, making decisions, and interacting with users or other systems. They are widely used to automate processes and enhance...'
---

![cover](/images/posts/post2/cover.jpg)

## 1\. Introduction

An _AI Agent_ is an intelligent systems capable of autonomously performing tasks, making decisions, and interacting with users or other systems. They are widely used to automate processes and enhance user experiences across domains like customer support, data analysis, and content generation. While their applications are broad, providing a precise, universally accepted definition of AI agents remains challenging due to the evolving nature of the field.

In this context, an _AI agent_ is a system composed of the following components:

* **Goal and Role**: The specific task or objective the agent aims to accomplish.
* **Brain**: The underlying algorithm, often a large language model (LLM), that drives the agent's decision-making and text processing.
* **Memory and learning**: The agent's ability to store and retrieve past information, improving its performance over time through short-term and long-term memory.
* **Tools**: The actions or functions (e.g., APIs, databases) the agent uses to perform its tasks.
* **Interaction**: How the agent communicates with users or other systems, such as through a chat interface or event-based models.
* **Guardrails**: Rules that restrict the agent's behavior to ensure it operates safely and within defined limits, particularly important for security and preventing harmful actions.

### 2. Oracle OCI agents

![image2](/images/posts/post2/image2.png)
<i><center>
Figure 1. OCI Generative AI Agents Platform. Source: <a href="https://www.oracle.com/cloud/" target="_blank" rel="noopener noreferrer">Oracle Cloud Infrastructure</a>
</center></i>

Oracle has recently launched the new OCI Generative AI Agents Platform (Figure 1), a significant upgrade from its previous version that focused mainly on Retrieval Augmented Generation (RAG). 
This new platform allows users to create and deploy AI agents capable of an advanced set of actions, including custom-defined tools such as client executions and external API endpoints. 
Designed as a fully managed service, it simplifies AI agent development, making it accessible even to those without extensive programming expertise.

Key features of the OCI Generative AI Agents Platform include:

* **Agent Definition and Deployment**: A complete environment for defining and deploying AI agents.

* **Pre-built and custom tools**: _RAG (Retrieval-Augmented Generation)_, which enables agents to retrieve relevant information from a knowledge base, and _NL2SQL (Natural Language to SQL)_, which allows agents to convert natural language queries into SQL for interacting with databases and retrieving structured data. Also, users can integrate their own tools to extend agent functionality.

* **Context Retention**: Agents can store and recall past conversations, maintaining continuity.

* **Guardrails and content moderation**: Implement rules to control agent behavior, ensuring operation within defined boundaries and preventing harmful actions.

* **Human-in-the-Loop**: Incorporate human oversight and intervention when needed.

Additional information on the OCI Generative AI Agents Platform can be found in the [official documentation](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/overview.htm) and the [Oracle AI & Data Science Blog](https://blogs.oracle.com/ai-and-datascience/post/ga-of-oci-gen-ai-agent-platform).
    
## 3. Building a RAG agent using OCI Generative AI Agents

This post explains how to build a Retrieval-Augmented Generation (RAG) chat assistant using the OCI Generative AI Agents Platform. The assistant is designed to answer questions about poor practices in Docker files (Docker smells), using two research papers as its knowledge base. Data is uploaded to an Oracle storage bucket, and the OCI platform handles the rest (uploading, parsing, ingestion, logic, and deployment) without requiring writing any line of code.

### 3.1 What is RAG?

![image1](/images/posts/post2/rag-workflow.png)
<i><center>Figure 2. Retrieval-Augmented Generation (RAG) workflow</center></i>

In this article, we will focus on the RAG (Retrieval-Augmented Generation) capabilities of the OCI Generative AI Agents Platform. RAG is a powerful approach that combines the strengths of retrieval-based and generation-based methods to provide more accurate and contextually relevant responses. 

Simply, the RAG approach is composed of a source knowledge base, which can be a set of documents, a database, or an API, and a Large Language Model (LLM) that is used to generate the responses based on the retrieved information. 
The key idea behind RAG is to leverage the in-context learning capabilities of LLMs to generate responses requiring information that is not present in the training knowledge of the model. 
This also provides a source reference of the information used to generate the response, which can lead to a more accurate and reliable answer that can be validated by the user.

The RAG approach is particularly useful in scenarios where the information is constantly changing or evolving, such as in the case of scientific papers, news articles, or technical documentation. 
By using RAG, it is possible to create AI agents that can provide up-to-date and relevant information based on the latest data available in the source knowledge base.

Figure 1 shows the architecture of a RAG system, which is composed of three main components:

1. **Knowledge Base**: This is the source of information that the agent will use to retrieve relevant data. A common approach is to use a vector database, able to store and retrieve information based on semantic similarity.
2. **Q&A system**: Orchestrates the interaction between the user and the knowledge base. It is responsible for processing the user queries, retrieving relevant information from the knowledge base, and generating the responses using an LLM.
3. **LLM**: The large language model that is used to generate the responses based on the retrieved information. The LLM can be a pretrained foundation model or a fine-tuned model that is specifically designed for the task at hand. The LLM can be used to generate text, answer questions, or perform other tasks based on the retrieved information.

### 4.1 Preliminary steps

To use the OCI Generative AI Agents Platform, an OCI account is necessary. While the service isn't free, new users will receive free credits for testing the platform. Moreover, OCI offers a free tier that includes a limited set of services, which can be useful for experimenting with the platform and testing the capabilities of the agents.
To create an account, visit the [OCI website](https://www.oracle.com/cloud/).

OCI is organized by regions. Not all the regions available offer the complete set of services. A good pick for Europe is the Frankfurt region in Germany, the one that will be used for this post, providing most of the generative AI features available in OCI.

A good practice before starting to use the OCI services is to create a compartment to isolate and control the resources used by a specific project. 
This helps to keep an eye on the costs by setting a spending threshold and receiving an alert when that threshold is passed.

### 4.2 Preparing the knowledge data

As mentioned, the knowledge of our agent will be composed of research papers related to Dockerfile smells. Specifically, we will use a paper by Rosa et al. \[1\].
The study investigates what are the most fixed Dockerfile smells by developers in the open-source domain, with the goal to understand what are the most important smells that should be avoided when developing a Dockerfile.

To achieve this, we need to create a storage bucket in which we upload the PDF of the papers to allow successive processing. 
A guide on how to create a storage bucket can be found in the [official documentation](https://docs.oracle.com/en-us/iaas/Content/Object/Tasks/creatingbucket.htm). Basically, a storage bucket is a container that enables storing and organizing data in OCI.
The next step is to start the agent creation process via the _Generative AI Agents_ platform.

### 4.3 Creating the agent logic

![image3](/images/posts/post2/image3.png)
<i><center>
Figure 3. New agent. Source: <a href="https://www.oracle.com/cloud/" target="_blank" rel="noopener noreferrer">Oracle Cloud Infrastructure</a>
</center></i>

The first section (Figure 3) requires some basic information about the agent, such as the name and a welcome message. A good practice is to provide a brief description of the agent's capabilities and the topics it can cover, so that the user knows what to expect from the agent.
In the next section, _Add tool_, we have to select the RAG tool, in which we assign the knowledge (_New knowledge base_) by selecting one of the available source options. In our case, we will use the _Object Storage_ option, where we specify as data source the PDF file uploaded previously (_Data sources > Specify data source_).
Finally, selecting the _"Automatically start ingestion job for above data sources_" checkbox, the platform will execute an ingestion job automatically, which processes the PDF file, extracting and processing the text in a format that can be used by the agent. The ingestion process can take some time, depending on the size of the files and the complexity of the data.

### 4.4 Configuring the agent endpoint

At this point, we have a knowledge base that contains the information we want to use to answer questions related to Dockerfile smells. We can verify it by visiting the _"Knowledge Bases"_ tab.
The last step is to configure the settings of the agent endpoint, which is the interface through which the agent will interact with users.
First, make sure to select the _"Automatically create an endpoint"_ checkbox, which will create an API endpoint necessary to interact with the agent via the chat interface. 

Additionally, we can define some additional features for our endpoint, such as content moderation, protection against malicious requests (_i.e.,_ prompt injection), and the removal of sensitive information from input and/or output responses (_i.e.,_ personally identifiable information, PII).
The last feature is crucial in contexts where we are dealing with sensitive information, and helps to ensure that the agent does not inadvertently expose sensitive data in its responses.

### 4.5 Run and test the agent

![image4](/images/posts/post2/image4.png)
<i><center>
Figure 4. Chat example. Source: <a href="https://www.oracle.com/cloud/" target="_blank" rel="noopener noreferrer">Oracle Cloud Infrastructure</a>
</center></i>

Now everything is ready to test our agent! From the _Generative AI Agents > Chat_ tab, we can interact with the agent using a chat playground interface. 
Our agent is an expert on Dockerfile smells, thanks to the knowledge base we created, so we will ask questions related to that topic.
Before using the chat, select from the dropdown menu on the top the agent and the endpoint created in the previous steps.
 
The chat playground does not require any programming knowledge, as it provides a user-friendly interface to interact with the agent. For advanced integrations or customizations, the platform also provides an API that can be used to interact with the agent programmatically via the OCI SDKs or directly via HTTP requests.

By default, our agent will use English as the language for the interaction (like the content of the knowledge base). A suggestion, is to keep the knowledge base in a language in which the LLM used by the agent is proficient (e.g., English), as this will ensure that the agent will be more accurate and reliable in its responses.

To change that behavior, we ask the agent to answer in Italian, keeping the response brief and concise (Figure 4). The agent will then use the knowledge base to look for relevant information, and then generate a response in Italian.

Continuing with the example, we ask the agent to provide a list of the most common Dockerfile smells with a brief description of each one. The agent retrieves the relevant information from the knowledge base and generates a response that includes a list of the most common Dockerfile smells, along with a brief description of each one.

We have the option to show a log of the interactions with a detail of the used sources, which can be useful to understand how the agent arrived at the answer and to verify the correctness of the information provided (Figure 4). 

## 5\. Final remarks

In this post, we explored the process of creating a RAG agent using the OCI Generative AI Agents Platform. 
We started by defining what AI agents are and how they can be used to assist users in various domains. Then, we briefly introduced the RAG approach, which combines the strengths of retrieval-based and generation-based methods to provide more accurate and contextually relevant responses.

We then walked through the steps to create a RAG agent using the OCI Generative AI Agents Platform, starting from the creation of a storage bucket to upload the knowledge base, to the configuration of the agent endpoint.
The agent was able to answer questions related to Dockerfile smells, using the knowledge base we created, which contained research papers on the topic. All of this was done without writing a single line of code.

Since the OCI Generative AI Agents Platform is continuously evolving, and new features are being added the content of this post may become outdated in the future. The goal was to provide a basic example on how to create a simple agent using the platform, which can be extended and customized to suit specific needs.
The recommendation is to always refer to the [official documentation](https://docs.oracle.com/en-us/iaas/Content/generative-ai-agents/overview.htm) for the latest updates and features, or to rely on professional support for more complex use cases.
  
### References
\[1\] _Rosa, G., Zappone, F., Scalabrino, S., & Oliveto, R. (2024). Fixing dockerfile smells: An empirical study. Empirical Software Engineering, 29(5), 108._

*\*Please note all screenshots are the property of Oracle and are used according to their Copyright Guidelines*

<!-- ### Limitazioni e Sfide di rag

* Dipendenza dalla qualità dei documenti
    
* Overhead computazionale elevato
    
* Complessità nell'integrazione con sistemi esistenti
    
* Necessità di aggiornamenti continui per mantenere la rilevanza delle informazioni
    
* Possibili bias nei dati di addestramento che possono influenzare le risposte
    
* Costi significativi associati all'implementazione e alla manutenzione del sistema, inclusi i costi del servizio Oracle Agents -->