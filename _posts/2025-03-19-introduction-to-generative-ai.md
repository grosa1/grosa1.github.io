---
title: 'A gentle Introduction to OCI Generative AI services'
date: 2025-03-19
permalink: /posts/2025/introduction-to-oci-generative-ai
tags:
  - oracle-generative-ai
  - oci 
  - python
excerpt: 'This article aims to provide a comprehensive guide for beginners to get started with Oracle Cloud Infrastructure (OCI) Generative AI service. This article covers everything from creating an account to...'
---

![image1](/images/posts/post1/cover1.jpg)

## Introduction

This article aims to provide a comprehensive guide for beginners to get started with Oracle Cloud Infrastructure (OCI) Generative AI service. This article covers everything from creating an account to setting up the environment and running the first AI task using Python, starting with a brief overview of the main features.

The Oracle Cloud Infrastructure is one of the big cloud platforms currently available in the market together with AWS, Google Cloud, and Azure. Among the others, OCI offers several AI services, from the GPU infrastructure to AI-based services such as a powerful platform for creating and deploying GenAI-powered apps. OCI Generative AI provides a collection of state-of-the-art Large Language Models (LLMs) specialized for various tasks, including text generation, summarization, and text embeddings. These models can be fine-tuned with custom datasets and deployed on a dedicated AI cluster. Also, content moderation and controls are available to model endpoints. Currently, available models include the Meta Llama series and Cohere's Command R and R+, accessible through the OCI SDK (supporting Python, Java, and Node.js), OCI CLI, and the Chat Playground. Additionally, the OCI SDK is integrated with popular open-source frameworks like LangChain and LlamaIndex.


## Getting started with OCI Generative AI

Before getting hands-on with the code, there are several preliminary steps to follow to set up the required resources on OCI.

1\. **Creating an Account**: visit the [Oracle Cloud website](https://www.oracle.com/it/cloud/sign-in.html) and sign up for an account. You'll need to provide some basic information and verify your email address. Once your account is created, you can access the OCI Console. A free trial is available for new users, which includes some credits to experiment with the services.
    
2\. **Navigating the OCI Console**: The OCI Console is your main interface for managing cloud resources. Familiarize yourself with the dashboard, where you can access various services, monitor usage, and configure settings. Specifically, the playground allows us to experiment with the models hosted on OCI easily. To access the playground, navigate to *Generative AI > Playground > Chat* and select the model you want to use. An example of the [OCI Generative AI Playground](https://www.oracle.com/cloud/) is shown below (Figure 1).

![image1](/images/posts/post1/oci-genai-playground.jpg)
<i><center>Figure 1. OCI Generative AI Playground. Source: <a href="https://www.oracle.com/cloud/" target="_blank" rel="noopener noreferrer">Oracle Cloud Infrastructure</a></center></i>

3\. **Generating an API key**: After creating your account, you'll need to create an API key that is mandatory for authentication with the OCI Generative AI service. To create an API key:
  - Go to your profile settings, find *Resources > API keys* and click on the *Add Public Key* button.
  - Then, check on *Generate API key pair* and download the private and public key files (*e.g.,* default `~/.oci` directory).
  - When finished, click on the *Add* button.
        
The last step is to create a configuration file that contains the necessary information to authenticate with the OCI services. An example of the configuration file is prompted after the API key creation. As suggested, store the configuration file in the default location `~/.oci/config`. Be sure to set the correct path of the previously downloaded private key in the configuration file.
    
For example:
    
```bash
[DEFAULT]
user=<your-oci-user-ocid>  # TODO
fingerprint=<your-fingerprint>  # TODO
tenancy=<your-tenancy-ocid>  # TODO
region=eu-frankfurt-1  # Frankfurt EU region
key_file=/home/sammy/.oci/my-private-key.pem  # TODO: Full path to the private key
```
    
4\. **Create a Compartment**: Compartments are logical containers that help you organize and control access to your cloud resources. You can create a new compartment from the OCI Console by navigating to *Identity > Compartments* and clicking on *Create Compartment*.
    
## Setting up the environment

Before running your first AI task, you need to set up the environment by installing the necessary libraries and dependencies. The requirement is to have [Python](https://www.python.org/downloads/) installed on your machine, since in this article we use Python to interact with the OCI Generative AI service.

Next, you must set up a virtual environment to manage the dependencies of your project. You can use `venv` or `conda` to create a virtual environment. Here's how to create a virtual environment using `conda`:

1\. Install `miniconda` by following the instructions [here](https://www.anaconda.com/docs/getting-started/miniconda/install#quickstart-install-instructions).
    
2\. Create and activate a new conda environment:
    
```bash
conda create --name oci-genai python=3.11
conda activate oci-genai
```
    
3\. Install the [`oci-python-sdk`](https://github.com/oracle/oci-python-sdk) library using `pip` :
    
```bash
pip install oci
```

## Running the first AI task

Now that the setup is complete, we can run our first task using the OCI Generative AI service. In the following examples, we use the `oci-python-sdk` library to interact with the model inference endpoints.

An interesting feature of OCI Generative AI that we will cover is the `seed` parameter, recently introduced in the API, which forces the model backend to generate deterministic responses from the model for the same input. However, it is not fully guaranteed but can be useful for debugging and testing purposes.

Create a new Python script called `main.py` and use the snippets below to run your first AI task. To execute, run `python main.py` in your terminal after activating the virtual environment.

### 1\. Setup the authentication and OCI Generative AI client

The authentication is handled by the OCI SDK, which reads the configuration file from the default location `~/.oci/config`:

```python
import oci
from oci.generative_ai_inference import GenerativeAiInferenceClient
from oci.retry import NoneRetryStrategy

# Read DEFAULT profile from OCI config
config = oci.config.from_file("~/.oci/config", "DEFAULT")
# Validate the config file
oci.config.validate_config(config)

# OCI configuration
OCI_COMPARTMENT_ID = "your.oci.compartment.ocid"  # TODO: Set your compartment OCID
OCI_INFERENCE_ENDPOINT = "https://inference.generativeai.eu-frankfurt-1.oci.oraclecloud.com"  # EU Frankfurt region
SEED = 123  # Seed parameter for the current chat session

# Create the Inference client
genai_client = GenerativeAiInferenceClient(
    config=config, 
    service_endpoint=OCI_INFERENCE_ENDPOINT, 
    retry_strategy=NoneRetryStrategy(),  # Set a retry strategy
    timeout=(10, 240)  # Connect and read timeout
)
```

### 2\. Example for Meta Llama models hosted on OCI

The OCI SDK provides two distinct implementations for the available chat models, one for the Llama models and one for the Cohere models. The complete list of available models can be found in the [OCI Generative AI documentation](https://docs.oracle.com/en-us/iaas/Content/generative-ai/pretrained-models.htm). The Llama models are implemented using the `GenericChatRequest` and the following example demonstrates how to use them.

```python
from oci.generative_ai_inference.models import (
    ChatDetails, 
    GenericChatRequest, 
    SystemMessage, 
    AssistantMessage, 
    UserMessage, 
    TextContent, 
    OnDemandServingMode
)

# Specify the OCI model ID
OCI_MODEL_ID = "meta.llama-3.3-70b-instruct"

# Define the chat conversation
# The conversation starts with the system message and then the user message
# Supported roles: SYSTEM, USER, ASSISTANT
messages = [
    SystemMessage(content=[TextContent(text="Sei un menestrello del medioevo che racconta storie ai viaggiatori")]),
    UserMessage(content=[TextContent(text="Raccontami una breve storia")])
    # Add more chat history if needed
    # AssistantMessage(content=[TextContent(text="C'era una volta...")]),
    # UserMessage(content=[TextContent(text="E poi?")]),
]

# Compose the chat request
chat_request = GenericChatRequest(
    seed=SEED,  # Forces the model to generate a deterministic response, but not fully guaranteed
    api_format="GENERIC",
    messages=messages,
    max_tokens=1000,  # Limit response length
    temperature=0.7  # Controls the creativity of the model. Lower values mean less creative
)

# Compose the chat request details
chat_detail = ChatDetails(
    serving_mode=OnDemandServingMode(model_id=OCI_MODEL_ID),
    chat_request=chat_request,
    compartment_id=OCI_COMPARTMENT_ID
)

chat_response = genai_client.chat(chat_detail)

# Print result
response_text = chat_response.data.chat_response.choices[0].message.content[0].text

print("************************** Chat Result **************************\n")
print(response_text)
```

An output of the above code snippet is the following:

```plaintext
************************** Chat Result **************************

 **La Leggenda del Cavaliere della Luna**

Oh, ascoltate, viaggiatori, e lasciate che le mie parole vi trasportino in un'epoca di antica magia e valorosi cavalieri. La storia che sto per raccontarvi è quella di un cavaliere coraggioso, noto come il Cavaliere della Luna.

In una terra lontana, dove le stelle brillavano con intensità e la luna piena illuminava le notti, viveva un cavaliere di nome Sir Edward. Era un guerriero leale e onesto, amato dal suo popolo e rispettato dai suoi pari. Sir Edward possedeva un dono unico: poteva comunicare con gli animali della foresta, e in particolare con un grande cavallo bianco, noto come Alba.

Una notte, mentre la luna era alta nel cielo, Sir Edward ricevette una visione misteriosa. Una voce gli sussurrò all'orecchio di recarsi al castello abbandonato di Malakai, dove una principessa era stata imprigionata da un dragone crudele. Il cavaliere, senza esitare, sellò Alba e partì verso il castello.

Durante il viaggio, incontrarono molte difficoltà e pericoli, ma Sir Edward e Alba superarono ogni ostacolo con coraggio e astuzia. Quando finalmente raggiunsero il castello, trovarono la principessa imprigionata in una torre alta e il dragone che la sorvegliava.

Sir Edward, con la sua spada in mano, sfidò il dragone e lo sconfisse in un duello epico. La principessa fu liberata e ringraziò il cavaliere per il suo coraggio. Da quel giorno, Sir Edward divenne noto come il Cavaliere della Luna, e la sua leggenda si diffuse in tutta la terra.

E così, viaggiatori, la storia del Cavaliere della Luna ci ricorda che il coraggio e la lealtà possono superare anche gli ostacoli più grandi, e che la magia della luna può guidarci verso la vittoria e la gloria.

**Fine della storia**

Spero che vi sia piaciuta, viaggiatori! Se desiderate ascoltare altre storie, sono qui per raccontarvele.
```

### 3\. Example for Cohere OCI models hosted on OCI

On the other hand, the Cohere models are implemented using the `CohereChatRequest` and `CohereSystemMessage` classes. The following example demonstrates how to use the Cohere models from Cohere hosted on OCI.

```python
from oci.generative_ai_inference.models import (
    ChatDetails, 
    CohereChatRequest, 
    CohereSystemMessage, 
    OnDemandServingMode
)

# Specify the OCI model ID
OCI_MODEL_ID = "cohere.command-r-08-2024"  # or cohere.command-r-plus-08-2024

# Add chat history
chat_history = [
    CohereSystemMessage(message="Sei un menestrello del medioevo che racconta storie ai viaggiatori")
    # Add more chat history if needed
    # CohereUserMessage(message="Raccontami una breve storia")
    # CohereChatBotMessage(message="C'era una volta...")
]
# Define the input message
user_message = "Raccontami una breve storia"

# Compose the chat request
chat_request = CohereChatRequest(
    seed=SEED,  # Forces the model to generate a deterministic response, but not fully guaranteed
    chat_history=chat_history,
    message=user_message,
    max_tokens=1000,  # Limit response length
    temperature=0.7  # Controls the creativity of the model. Lower values mean less creative
)

# Compose the chat request details
chat_detail = ChatDetails(
    serving_mode=OnDemandServingMode(model_id=OCI_MODEL_ID),
    chat_request=chat_request,
    compartment_id=OCI_COMPARTMENT_ID
)

chat_response = genai_client.chat(chat_detail)

# Print result
response_text = chat_response.data.chat_response.chat_history[-1].message

print("************************** Chat Result **************************\n")
print(response_text)
```

An output of the above code snippet is the following:

```plaintext
************************** Chat Result **************************

Incamminatevi, o viandanti, e prestate orecchio a questa storia che vi narrerò. Era una fredda notte d'inverno, quando un valoroso cavaliere, di nome Corvo, si trovò ad affrontare una terribile tempesta di neve. Il vento ululava e la visibilità era quasi nulla, ma il nostro eroe non si lasciò scoraggiare.

Corvo, con il suo fedele destriero, cavalcava senza sosta, cercando rifugio in quel gelido paesaggio. Ad un tratto, scorse una luce tremolante in lontananza, come un barlume di speranza. Si diresse verso quella direzione, guidando il suo cavallo attraverso la bufera.

Arrivato a destinazione, trovò un'antica locanda, avvolta dal mistero. La porta si aprì con un cigolio, rivelando un caldo focolare e un'accogliente atmosfera. Il locandiere, un uomo saggio e burbero, offrì a Corvo un pasto caldo e un riparo per la notte.

Mentre il cavaliere riposava, sognò di un'avventura che lo attendeva. Una misteriosa principessa era stata rapita da un drago malvagio, e solo lui poteva salvarla. Armato di coraggio e della sua fidata spada, Corvo si preparò ad affrontare il mostro.

Il giorno seguente, il nostro eroe partì alla ricerca del drago. Attraversò foreste oscure e montagne impervie, affrontando pericoli e insidie. Finalmente, raggiunse la tana del drago, un luogo tenebroso e pieno di tesori rubati.

Con un'ultima carica coraggiosa, Corvo affrontò il drago in un duello epico. La sua spada scintillava sotto i raggi del sole, mentre il drago sputava fuoco e terrore. Ma la determinazione del cavaliere ebbe la meglio, e alla fine riuscì a sconfiggere la creatura.

Liberando la principessa, Corvo divenne un eroe leggendario. La sua storia si diffuse in tutto il regno, e il suo nome fu cantato dai menestrelli per generazioni. E così, o cari viandanti, vi lascio con questa avventura, ricordandovi che il coraggio e la determinazione possono superare qualsiasi tempesta.

E ora, vi lascio con una canzone che celebra le gesta di Corvo, il cavaliere coraggioso!
```

## Conclusion

This article provided an overview of OCI Generative AI, including a step-by-step guide to getting started with the service, setting up an environment, and running your first AI task using the OCI Python SDK using the models from Llama and Cohere hosted on OCI. For more information, refer to the [OCI Generative AI documentation](https://docs.oracle.com/en-us/iaas/Content/generative-ai/overview.htm).


_*Please note all screenshots are the property of Oracle and are used according to their Copyright Guidelines._