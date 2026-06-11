import type {
  DrillableTerm,
  DrilldownInput,
  DrilldownOutput,
  ExplainInput,
  ExplainOutput,
  LearnerLevel
} from "@/types/learning";
import { compactTerms, normalizeTerm } from "@/lib/text";

type SeededConcept = {
  aliases: string[];
  explanation: ExplainOutput;
  drilldowns: Record<string, DrilldownOutput>;
};

type LevelCopy = {
  summaryAddendum: string;
  keyTerms: DrillableTerm[];
  prerequisites: string[];
  analogy: string;
  question: string;
  expectedAnswer: string;
};

function term(term: string, reason: string, difficulty: DrillableTerm["difficulty"]): DrillableTerm {
  return { term, reason, difficulty };
}

function key(parent: string, selected: string) {
  return `${normalizeTerm(parent)}::${normalizeTerm(selected)}`;
}

const seededConcepts: SeededConcept[] = [
  {
    aliases: ["kubernetes", "k8s", "what is kubernetes"],
    explanation: {
      concept: "Kubernetes",
      level: "beginner",
      summary:
        "Kubernetes is a system for running applications across a group of machines. Teams package app pieces into containers, then ask Kubernetes to keep the right number of copies running. It watches the desired state, places work onto nodes inside a cluster, restarts failed pods, and helps with scaling when traffic changes. Instead of a person manually checking every server, Kubernetes keeps comparing what should be true with what is actually running and takes action when they drift apart.",
      key_terms: [
        term("containers", "Kubernetes mainly runs and manages containerized app pieces.", "medium"),
        term("cluster", "The group of machines Kubernetes coordinates.", "easy"),
        term("desired state", "The target condition Kubernetes tries to maintain.", "medium"),
        term("nodes", "The machines that run application work.", "easy"),
        term("pods", "The smallest deployable unit in Kubernetes.", "medium"),
        term("scaling", "A core reason teams use Kubernetes in production.", "easy")
      ],
      prerequisites: ["application", "server", "container"],
      analogy:
        "Think of Kubernetes like an operations manager for apps: you describe what should be running, and it keeps checking the floor until reality matches the plan.",
      check_understanding: [
        {
          question: "What does Kubernetes keep comparing?",
          expected_answer: "It compares the desired state with what is actually running."
        }
      ],
      safety_note: null
    },
    drilldowns: {
      [key("Kubernetes", "containers")]: {
        term: "containers",
        parent_concept: "Kubernetes",
        contextual_explanation:
          "In Kubernetes, containers are packaged units of application code and the settings needed to run that code. Kubernetes does not usually start raw source files by itself; it starts containers from container images. Because each container starts in a consistent way, Kubernetes can move it, restart it, or run more copies on different machines without a human reinstalling the app each time.",
        why_it_matters_here:
          "Containers are the work units Kubernetes schedules, restarts, and scales across a cluster.",
        new_terms: ["container image", "runtime", "process isolation", "Docker"],
        depth_warning: false,
        simple_example:
          "A checkout service can be packaged as a container, and Kubernetes can run five copies when the store gets busy.",
        safety_note: null
      },
      [key("containers", "container image")]: {
        term: "container image",
        parent_concept: "containers",
        contextual_explanation:
          "A container image is the saved package used to create a running container. It includes the application files, dependency instructions, and startup command. In Kubernetes, a pod points to an image, and the node pulls that image before starting the container. The image is like a recipe plus sealed ingredients; the running container is the meal made from it.",
        why_it_matters_here:
          "Kubernetes needs images so it can create the same container repeatedly on any suitable node.",
        new_terms: ["runtime", "registry", "layers"],
        depth_warning: false,
        simple_example:
          "If an image says to run a web server on port 8080, Kubernetes can use it to start identical web server containers.",
        safety_note: null
      },
      [key("container image", "runtime")]: {
        term: "runtime",
        parent_concept: "container image",
        contextual_explanation:
          "A container runtime is the software on a node that actually starts and stops containers from images. Kubernetes decides what should run, then asks the runtime to do the low-level work. The runtime talks to the operating system so the container gets its process, filesystem view, and resource limits.",
        why_it_matters_here:
          "Without a runtime, Kubernetes would have plans and images but no local engine to turn them into running containers.",
        new_terms: ["containerd", "kernel", "process"],
        depth_warning: true,
        simple_example:
          "Kubernetes may schedule a pod onto a node, then containerd pulls the image and starts the container process.",
        safety_note: null
      },
      [key("Kubernetes", "cluster")]: {
        term: "cluster",
        parent_concept: "Kubernetes",
        contextual_explanation:
          "A Kubernetes cluster is the full set of machines and control services working together. Some parts decide what should happen, while worker machines run the app workloads. The cluster gives teams one coordinated environment instead of a pile of separate servers that must be managed one by one.",
        why_it_matters_here:
          "Kubernetes is valuable because it treats many machines as one coordinated platform for applications.",
        new_terms: ["node", "control plane", "networking", "pods"],
        depth_warning: false,
        simple_example:
          "A cluster might have three worker machines running app pods and a control plane deciding where new pods should go.",
        safety_note: null
      },
      [key("cluster", "node")]: {
        term: "node",
        parent_concept: "cluster",
        contextual_explanation:
          "A node is a machine inside a Kubernetes cluster that can run application work. It can be a physical server or a virtual machine. Kubernetes checks each node's available CPU, memory, and health before placing pods there. Nodes also run local agents that report back to the cluster and make sure assigned pods keep running.",
        why_it_matters_here:
          "Nodes are where Kubernetes turns scheduling decisions into actual running applications.",
        new_terms: ["pod", "kubelet", "capacity", "scheduler"],
        depth_warning: false,
        simple_example:
          "If one node is full, Kubernetes can place the next pod on another healthier node with more room.",
        safety_note: null
      },
      [key("node", "pod")]: {
        term: "pod",
        parent_concept: "node",
        contextual_explanation:
          "A pod is the smallest unit Kubernetes places on a node. It usually holds one main container, though it can hold closely related containers that need to share networking or storage. Kubernetes schedules pods rather than individual app files, so pods are the practical shape of work that lands on nodes.",
        why_it_matters_here:
          "Understanding pods explains what Kubernetes actually starts, stops, moves, and replaces.",
        new_terms: ["container", "IP address", "volume"],
        depth_warning: false,
        simple_example:
          "A pod might run one API container with its own cluster IP address so other services can reach it.",
        safety_note: null
      },
      [key("Kubernetes", "desired state")]: {
        term: "desired state",
        parent_concept: "Kubernetes",
        contextual_explanation:
          "Desired state is the version of the system you asked Kubernetes to maintain. You might say that three copies of an API should be running. Kubernetes constantly compares that request with reality. If one copy crashes, reality no longer matches the desired state, so Kubernetes starts another copy.",
        why_it_matters_here:
          "Desired state is the mental model behind Kubernetes automation.",
        new_terms: ["declarative configuration", "controller", "reconciliation"],
        depth_warning: false,
        simple_example:
          "If desired state is three pods and only two are healthy, Kubernetes creates or restarts one.",
        safety_note: null
      },
      [key("Kubernetes", "nodes")]: {
        term: "nodes",
        parent_concept: "Kubernetes",
        contextual_explanation:
          "Nodes are the machines Kubernetes uses to run pods. Each node contributes compute capacity, such as CPU and memory. Kubernetes watches node health and chooses suitable nodes for new work. If a node fails, Kubernetes can move replacement pods to other healthy nodes.",
        why_it_matters_here:
          "Kubernetes coordinates nodes so applications are not tied to one fragile machine.",
        new_terms: ["pod", "kubelet", "capacity"],
        depth_warning: false,
        simple_example:
          "A cluster with six nodes can keep an app running even if one node needs maintenance.",
        safety_note: null
      },
      [key("Kubernetes", "pods")]: {
        term: "pods",
        parent_concept: "Kubernetes",
        contextual_explanation:
          "Pods are Kubernetes' smallest deployable units. A pod wraps one or more containers with shared networking and lifecycle rules. Kubernetes creates, replaces, and schedules pods to keep applications running according to the desired state.",
        why_it_matters_here:
          "Most Kubernetes actions eventually affect pods, so pods are the center of the app-running story.",
        new_terms: ["container", "scheduler", "service"],
        depth_warning: false,
        simple_example:
          "A deployment may ask Kubernetes to keep three identical API pods running at all times.",
        safety_note: null
      },
      [key("Kubernetes", "scaling")]: {
        term: "scaling",
        parent_concept: "Kubernetes",
        contextual_explanation:
          "Scaling means changing how much app capacity is running. In Kubernetes, that often means increasing or decreasing the number of pod copies. More pods can handle more traffic; fewer pods can save resources when demand falls.",
        why_it_matters_here:
          "Scaling is one of the main jobs Kubernetes automates once apps are packaged as pods.",
        new_terms: ["replica", "autoscaling", "resource limits"],
        depth_warning: false,
        simple_example:
          "During a sale, Kubernetes might raise an app from three pods to ten pods, then lower it later.",
        safety_note: null
      }
    }
  },
  {
    aliases: ["neural networks", "neural network", "how do neural networks learn"],
    explanation: {
      concept: "Neural networks",
      level: "beginner",
      summary:
        "Neural networks are computer systems that learn patterns from examples. They are made of layers of small calculation units often called neurons. Each connection has a weight that controls how strongly one value affects the next. During training, the network looks at training data, makes a prediction, measures the error with a loss function, and adjusts weights through backpropagation. After many examples, the network can make useful predictions on new inputs that resemble what it learned from.",
      key_terms: [
        term("neurons", "The small calculation units that make up a network.", "easy"),
        term("layers", "How neurons are organized into stages.", "easy"),
        term("weights", "The adjustable values the network learns.", "medium"),
        term("training data", "The examples used to teach the network.", "easy"),
        term("loss function", "The score that tells the network how wrong it was.", "medium"),
        term("backpropagation", "The method used to update weights after errors.", "hard")
      ],
      prerequisites: ["data", "prediction", "function"],
      analogy:
        "Think of a neural network like a sound mixer with many knobs; training slowly turns the knobs until the output sounds closer to the target.",
      check_understanding: [
        {
          question: "What changes while a neural network learns?",
          expected_answer: "Its weights change based on errors measured during training."
        }
      ],
      safety_note: null
    },
    drilldowns: {
      [key("Neural networks", "neurons")]: {
        term: "neurons",
        parent_concept: "Neural networks",
        contextual_explanation:
          "In a neural network, a neuron is a small calculation that receives numbers, combines them using weights, and passes a result forward. It is not a tiny brain cell; it is a math step. Many simple neurons connected together can model complicated patterns.",
        why_it_matters_here:
          "Neurons are the basic units that let a neural network transform inputs into predictions.",
        new_terms: ["activation", "input", "output"],
        depth_warning: false,
        simple_example:
          "A neuron might combine pixel brightness values to help detect whether part of an image contains an edge.",
        safety_note: null
      },
      [key("Neural networks", "layers")]: {
        term: "layers",
        parent_concept: "Neural networks",
        contextual_explanation:
          "Layers are groups of neurons that process information in stages. Early layers often detect simple patterns, while later layers combine those patterns into more useful signals. The output of one layer becomes the input to the next.",
        why_it_matters_here:
          "Layers explain how a network builds from raw input toward a final prediction.",
        new_terms: ["input layer", "hidden layer", "output layer"],
        depth_warning: false,
        simple_example:
          "In an image model, one layer may detect edges while a later layer helps recognize wheels or windows.",
        safety_note: null
      },
      [key("Neural networks", "weights")]: {
        term: "weights",
        parent_concept: "Neural networks",
        contextual_explanation:
          "Weights are adjustable numbers on the connections between neurons. A larger weight makes one signal matter more; a smaller weight makes it matter less. Learning mostly means changing weights so the network's predictions get closer to the right answers.",
        why_it_matters_here:
          "Weights are the memory of what the network has learned from training data.",
        new_terms: ["gradient", "parameter", "optimization"],
        depth_warning: false,
        simple_example:
          "If a word is a strong clue for spam, the network may learn a higher weight for that signal.",
        safety_note: null
      },
      [key("Neural networks", "training data")]: {
        term: "training data",
        parent_concept: "Neural networks",
        contextual_explanation:
          "Training data is the collection of examples the network learns from. Each example gives the model input, and often a target answer. The quality and variety of this data strongly affects what the network can learn and where it may fail.",
        why_it_matters_here:
          "A neural network cannot learn useful patterns without examples that represent the task.",
        new_terms: ["label", "dataset", "generalization"],
        depth_warning: false,
        simple_example:
          "A model that identifies handwritten digits needs many images of digits paired with their correct labels.",
        safety_note: null
      },
      [key("Neural networks", "loss function")]: {
        term: "loss function",
        parent_concept: "Neural networks",
        contextual_explanation:
          "A loss function is a score that measures how far the network's prediction is from the target answer. Training tries to reduce this score. The network uses the loss to know which direction to adjust its weights.",
        why_it_matters_here:
          "The loss function gives the network feedback; without it, training would not know what better means.",
        new_terms: ["error", "optimization", "gradient"],
        depth_warning: false,
        simple_example:
          "If the correct price is 100 and the model predicts 70, the loss tells training that the prediction missed by a lot.",
        safety_note: null
      },
      [key("Neural networks", "backpropagation")]: {
        term: "backpropagation",
        parent_concept: "Neural networks",
        contextual_explanation:
          "Backpropagation is the method that sends error information backward through the network after a prediction. It calculates how much each weight contributed to the error, then training uses those calculations to adjust the weights.",
        why_it_matters_here:
          "Backpropagation is the practical mechanism that lets deep networks learn from mistakes.",
        new_terms: ["gradient", "learning rate", "chain rule"],
        depth_warning: false,
        simple_example:
          "If the final answer is wrong, backpropagation works backward to decide which earlier knobs should turn slightly.",
        safety_note: null
      }
    }
  },
  {
    aliases: ["oauth", "oauth 2", "oauth2", "oauth 2.0"],
    explanation: {
      concept: "OAuth",
      level: "beginner",
      summary:
        "OAuth is a way for one app to get limited access to something you use in another service without asking for your password. Instead of giving a calendar app your Google password, you approve a specific permission. An authorization server checks the login and issues an access token. The client app uses that token to call an API, and scopes limit what the token can do. OAuth is mainly about authorization: letting an app do a specific thing on your behalf.",
      key_terms: [
        term("authorization", "OAuth is about granting permission, not sharing passwords.", "medium"),
        term("client app", "The app requesting access.", "easy"),
        term("authorization server", "The service that handles approval and token issuing.", "medium"),
        term("access token", "The short-lived credential used by the app.", "medium"),
        term("scopes", "The permissions attached to a token.", "easy"),
        term("redirect URI", "The approved return address after login.", "medium")
      ],
      prerequisites: ["API", "account", "permission"],
      analogy:
        "OAuth is like giving a valet key: it grants limited access for a purpose without handing over the master key.",
      check_understanding: [
        {
          question: "What does OAuth help avoid sharing?",
          expected_answer: "It helps avoid sharing the user's password with the client app."
        }
      ],
      safety_note: null
    },
    drilldowns: {
      [key("OAuth", "authorization")]: {
        term: "authorization",
        parent_concept: "OAuth",
        contextual_explanation:
          "Authorization means deciding what an app is allowed to do. In OAuth, the user or service grants limited permission, such as reading calendar events. This is different from authentication, which is proving who the user is.",
        why_it_matters_here:
          "OAuth exists to grant limited permissions safely between apps.",
        new_terms: ["authentication", "permission", "resource owner"],
        depth_warning: false,
        simple_example:
          "You can authorize a scheduling app to read your calendar without letting it delete emails.",
        safety_note: null
      },
      [key("OAuth", "client app")]: {
        term: "client app",
        parent_concept: "OAuth",
        contextual_explanation:
          "The client app is the application asking for access to a protected resource. It could be a web app, mobile app, or backend service. The client app does not need your password; it asks the authorization server for a token after you approve access.",
        why_it_matters_here:
          "The client app is the actor OAuth is trying to empower without over-trusting.",
        new_terms: ["client ID", "client secret", "public client"],
        depth_warning: false,
        simple_example:
          "A travel app that wants to add flights to your calendar is the OAuth client app.",
        safety_note: null
      },
      [key("OAuth", "authorization server")]: {
        term: "authorization server",
        parent_concept: "OAuth",
        contextual_explanation:
          "The authorization server is the trusted system that handles login, consent, and token issuing. It checks who the user is, asks what access is allowed, and gives the client app an access token if the request is valid.",
        why_it_matters_here:
          "It keeps password handling and permission decisions away from the client app.",
        new_terms: ["consent screen", "token endpoint", "issuer"],
        depth_warning: false,
        simple_example:
          "Google's OAuth server can ask you to approve a calendar permission and then issue a token to the app.",
        safety_note: null
      },
      [key("OAuth", "access token")]: {
        term: "access token",
        parent_concept: "OAuth",
        contextual_explanation:
          "An access token is a credential the client app sends to an API to prove it has permission. Tokens are usually limited by time and scope. The API reads the token, checks whether the requested action is allowed, and responds if the token is valid.",
        why_it_matters_here:
          "The token is what replaces password sharing in the OAuth flow.",
        new_terms: ["bearer token", "expiration", "resource server"],
        depth_warning: false,
        simple_example:
          "A calendar API may accept a token that allows reading events for the next hour.",
        safety_note: null
      },
      [key("OAuth", "scopes")]: {
        term: "scopes",
        parent_concept: "OAuth",
        contextual_explanation:
          "Scopes are named permissions attached to an OAuth request or token. They limit what the client app can do. A token with read-only scope should not be able to write or delete data.",
        why_it_matters_here:
          "Scopes make OAuth useful because access can be specific instead of all-or-nothing.",
        new_terms: ["least privilege", "consent", "API permission"],
        depth_warning: false,
        simple_example:
          "A photo app might request a scope to read albums but not upload or delete photos.",
        safety_note: null
      },
      [key("OAuth", "redirect URI")]: {
        term: "redirect URI",
        parent_concept: "OAuth",
        contextual_explanation:
          "A redirect URI is the approved address where the authorization server sends the user after approval. It helps ensure the OAuth response goes back to the correct client app instead of an attacker-controlled location.",
        why_it_matters_here:
          "Redirect URIs are part of how OAuth keeps the handoff between services controlled.",
        new_terms: ["authorization code", "callback", "registered client"],
        depth_warning: false,
        simple_example:
          "After you approve access, the browser returns to the app's registered callback URL with a temporary code.",
        safety_note: null
      }
    }
  },
  {
    aliases: [
      "oracle acceleron",
      "acceleron",
      "oracle acceleron smartnic",
      "acceleron smartnic",
      "oracle acceleron shape",
      "acceleron shape",
      "acceleron shapes"
    ],
    explanation: {
      concept: "Oracle Acceleron",
      level: "beginner",
      summary:
        "Oracle Acceleron is OCI's SmartNIC-based architecture for moving more cloud networking, virtualization, and security work onto specialized hardware. Instead of treating the host NIC as a simple network card, Acceleron combines host networking with cloud control functions in one device. That helps preserve OCI's isolation model while reducing extra packet-handling steps that can add latency or consume host CPU. For users, the practical idea is that compatible shapes can get faster and more efficient networking and storage paths while still using familiar interfaces such as accelerated VirtIO and NVMe storage.",
      key_terms: [
        term("SmartNIC", "Acceleron is built around a programmable network device, not just a basic NIC.", "medium"),
        term("host NIC", "The older mental model Acceleron expands beyond.", "easy"),
        term("cloud control functions", "The cloud-managed networking and security work Acceleron moves closer to hardware.", "medium"),
        term("isolation model", "A core OCI design goal that Acceleron preserves.", "medium"),
        term("accelerated VirtIO", "The compatibility layer that keeps standard drivers while improving performance.", "hard"),
        term("NVMe storage", "A storage interface Acceleron can expose to instances over PCIe.", "medium"),
        term("compatible shapes", "The OCI compute shapes where Acceleron support is available.", "easy")
      ],
      prerequisites: ["virtual machine", "network card", "cloud networking"],
      analogy:
        "Think of Oracle Acceleron like moving traffic control, security checks, and loading dock coordination into a specialized building entrance instead of asking every tenant's office to handle that work.",
      check_understanding: [
        {
          question: "What kind of work does Oracle Acceleron move onto specialized hardware?",
          expected_answer:
            "It moves cloud networking, virtualization, storage-path, and security enforcement work closer to the SmartNIC hardware."
        }
      ],
      safety_note: null
    },
    drilldowns: {
      [key("Oracle Acceleron", "SmartNIC")]: {
        term: "SmartNIC",
        parent_concept: "Oracle Acceleron",
        contextual_explanation:
          "A SmartNIC is a programmable network adapter that can do more than pass packets between a server and the network. In Oracle Acceleron, the SmartNIC also helps run cloud networking, virtualization, security enforcement, and storage-path functions that would otherwise sit elsewhere or consume more host resources. That is why Acceleron is not just a faster network card; it is part of OCI's cloud infrastructure design.",
        why_it_matters_here:
          "SmartNIC is the hardware anchor for understanding how Acceleron changes the path between an instance and OCI networking or storage services.",
        new_terms: ["accelerated VirtIO", "cloud control functions", "host NIC", "PCIe"],
        depth_warning: false,
        simple_example:
          "A VM can use familiar virtual network and storage devices while the SmartNIC handles more of the cloud-managed work behind those devices.",
        safety_note: null
      },
      [key("SmartNIC", "accelerated VirtIO")]: {
        term: "accelerated VirtIO",
        parent_concept: "SmartNIC",
        contextual_explanation:
          "Accelerated VirtIO means Oracle Acceleron implements the common VirtIO interface using programmable hardware. The guest operating system can keep using standard VirtIO-style drivers, but the data path can be faster because more of the work happens on the SmartNIC. This balances two goals: broad software compatibility and better network performance.",
        why_it_matters_here:
          "Accelerated VirtIO explains how Acceleron can improve throughput and latency without requiring every workload to use custom hardware-specific drivers.",
        new_terms: ["VirtIO standard", "driver compatibility", "data path"],
        depth_warning: false,
        simple_example:
          "A Linux instance can see a familiar virtual network device while Acceleron handles packet movement through a faster hardware-backed path.",
        safety_note: null
      },
      [key("accelerated VirtIO", "VirtIO standard")]: {
        term: "VirtIO standard",
        parent_concept: "accelerated VirtIO",
        contextual_explanation:
          "The VirtIO standard is a common way for virtual machines to talk to virtual devices such as network adapters or disks. In the Acceleron context, VirtIO matters because it gives operating systems a familiar interface while OCI improves the implementation underneath. The learner does not need to memorize the spec; the key point is compatibility with a faster backend.",
        why_it_matters_here:
          "VirtIO is the bridge between ordinary VM drivers and Acceleron's hardware-backed acceleration.",
        new_terms: ["virtual device", "guest operating system", "backend"],
        depth_warning: true,
        simple_example:
          "The VM thinks it is using a normal virtual network adapter, while the platform uses Acceleron to make the traffic path more efficient.",
        safety_note: null
      },
      [key("Oracle Acceleron", "host NIC")]: {
        term: "host NIC",
        parent_concept: "Oracle Acceleron",
        contextual_explanation:
          "A host NIC is the network interface card attached to a server. In a traditional model, it mostly moves packets between the host and the physical network. Oracle Acceleron expands that role by combining the host NIC with cloud-managed networking and control functions. That means more infrastructure work can happen on the device rather than on the host CPU or separate boards.",
        why_it_matters_here:
          "Comparing Acceleron to a host NIC makes clear why Oracle describes it as an architecture shift, not just a new shape name.",
        new_terms: ["packet handling", "host CPU", "control plane"],
        depth_warning: false,
        simple_example:
          "Instead of a VM's network traffic bouncing through extra infrastructure components, Acceleron can streamline more of that path on one device.",
        safety_note: null
      },
      [key("Oracle Acceleron", "cloud control functions")]: {
        term: "cloud control functions",
        parent_concept: "Oracle Acceleron",
        contextual_explanation:
          "Cloud control functions are the platform-managed jobs that make cloud networking safe and usable: enforcing policy, managing virtualization, observing traffic behavior, and connecting instances to OCI services. Acceleron places more of these functions on the SmartNIC so the cloud provider can keep control and isolation while reducing extra hops and host overhead.",
        why_it_matters_here:
          "These functions are what make Acceleron part of OCI infrastructure rather than merely a network adapter upgrade.",
        new_terms: ["policy enforcement", "observability", "virtualization"],
        depth_warning: false,
        simple_example:
          "A packet can be checked against infrastructure policy earlier in the path instead of relying only on software running inside the host.",
        safety_note: null
      },
      [key("Oracle Acceleron", "isolation model")]: {
        term: "isolation model",
        parent_concept: "Oracle Acceleron",
        contextual_explanation:
          "An isolation model is the set of design choices that keeps tenants and workloads separated in a multitenant cloud. Oracle's FAQ emphasizes that Acceleron is meant to improve performance while preserving OCI's strong isolation approach. In plain terms, Acceleron should speed up the path without giving customer workloads unsafe control over shared cloud infrastructure.",
        why_it_matters_here:
          "Performance improvements only matter in cloud infrastructure if tenant separation and provider-controlled security remain intact.",
        new_terms: ["multitenant cloud", "tenant separation", "defense in depth"],
        depth_warning: false,
        simple_example:
          "Two customers can run workloads on shared cloud infrastructure while cloud-managed controls help keep their traffic and storage access separate.",
        safety_note: null
      },
      [key("Oracle Acceleron", "accelerated VirtIO")]: {
        term: "accelerated VirtIO",
        parent_concept: "Oracle Acceleron",
        contextual_explanation:
          "Accelerated VirtIO is Acceleron's way of giving instances a familiar virtual-device interface while improving the underlying hardware path. VirtIO is already common for virtual machines, so this design helps workloads use standard drivers while the SmartNIC handles more packet and device work efficiently.",
        why_it_matters_here:
          "It is the compatibility story: users get acceleration without needing to rethink every guest operating system image.",
        new_terms: ["VirtIO standard", "driver compatibility", "hardware-backed path"],
        depth_warning: false,
        simple_example:
          "A workload can boot with normal VirtIO networking, but the packet handling can be accelerated by the SmartNIC implementation.",
        safety_note: null
      },
      [key("Oracle Acceleron", "NVMe storage")]: {
        term: "NVMe storage",
        parent_concept: "Oracle Acceleron",
        contextual_explanation:
          "NVMe storage is a high-performance storage interface that operating systems understand as a fast local-style device. In the Acceleron architecture, the SmartNIC can expose NVMe-like storage devices to an instance over PCIe while translating the operations to OCI Block Storage with cloud policy and encryption controls still handled by the platform.",
        why_it_matters_here:
          "NVMe helps explain why Acceleron is about both networking and storage-path acceleration.",
        new_terms: ["PCIe", "OCI Block Storage", "namespace", "IOPS"],
        depth_warning: false,
        simple_example:
          "An instance can see a standard NVMe device while Acceleron manages the cloud storage connection behind it.",
        safety_note: null
      },
      [key("NVMe storage", "PCIe")]: {
        term: "PCIe",
        parent_concept: "NVMe storage",
        contextual_explanation:
          "PCIe is the high-speed connection standard used inside servers to connect devices such as network cards and storage controllers. For Acceleron, PCIe matters because the SmartNIC can present fast device interfaces, such as NVMe storage, directly to the compute instance while keeping cloud controls on the infrastructure side.",
        why_it_matters_here:
          "PCIe is the local hardware lane that helps make Acceleron's virtualized storage and networking feel closer to direct device access.",
        new_terms: ["device interface", "direct hardware access", "storage controller"],
        depth_warning: true,
        simple_example:
          "The instance can interact with a storage device over a PCIe-style path while OCI still manages the actual cloud storage service.",
        safety_note: null
      },
      [key("Oracle Acceleron", "compatible shapes")]: {
        term: "compatible shapes",
        parent_concept: "Oracle Acceleron",
        contextual_explanation:
          "Compatible shapes are the OCI compute shapes that can use Oracle Acceleron SmartNIC. The Oracle FAQ lists support for E6 Standard, E6 Dense, X12 Standard, and A4 Standard shapes, with availability to confirm in OCI documentation and the console. The important point is that Acceleron is chosen through supported instance shapes rather than installed like an application inside a VM.",
        why_it_matters_here:
          "This connects the architecture to the user's practical question: which OCI instances can actually use Acceleron.",
        new_terms: ["E6 Standard", "E6 Dense", "X12 Standard", "A4 Standard"],
        depth_warning: false,
        simple_example:
          "To adopt Acceleron, a team would launch or relaunch a workload on a supported shape instead of enabling it inside an existing incompatible instance.",
        safety_note: null
      },
      [key("Oracle Acceleron", "Zero Trust Packet Routing")]: {
        term: "Zero Trust Packet Routing",
        parent_concept: "Oracle Acceleron",
        contextual_explanation:
          "Zero Trust Packet Routing is an OCI security concept focused on least-privilege packet handling. In the Acceleron context, it matters because the SmartNIC can apply infrastructure-controlled policy earlier in the data path. That helps combine hardware acceleration with security enforcement instead of treating performance and policy as separate concerns.",
        why_it_matters_here:
          "It shows how Acceleron supports OCI's security story, not just its throughput story.",
        new_terms: ["least privilege", "policy enforcement", "data path"],
        depth_warning: false,
        simple_example:
          "Traffic can be checked against permitted paths near the host edge before it moves deeper through cloud infrastructure.",
        safety_note: null
      },
      [key("cloud control functions", "policy enforcement")]: {
        term: "policy enforcement",
        parent_concept: "cloud control functions",
        contextual_explanation:
          "Policy enforcement means applying rules about what traffic or storage operations are allowed. In Acceleron, enforcing policy on infrastructure-controlled hardware helps OCI keep security decisions outside the customer's guest OS while still allowing high-performance data movement.",
        why_it_matters_here:
          "It explains how Acceleron can improve performance without handing security control to the workload.",
        new_terms: ["least privilege", "guest OS", "infrastructure control"],
        depth_warning: true,
        simple_example:
          "A workload may send packets quickly, but platform policy can still decide which destinations are allowed.",
        safety_note: null
      }
    }
  }
];

const levelCopyByConcept: Record<string, Partial<Record<LearnerLevel, LevelCopy>>> = {
  Kubernetes: {
    intermediate: {
      summaryAddendum:
        "At an intermediate level, the useful mental model is a reconciliation system: teams submit declarative configuration, controllers compare that desired state against cluster reality, and the scheduler places pods where capacity and constraints fit. The tradeoffs are operational complexity, networking model choices, and learning how failures move through services, deployments, and nodes.",
      keyTerms: [
        term("declarative configuration", "How teams tell Kubernetes what state to maintain.", "medium"),
        term("controllers", "The automation loops that reconcile desired state with reality.", "medium"),
        term("scheduler", "The component that chooses where pods should run.", "medium"),
        term("service discovery", "How workloads find each other after pods move or restart.", "medium")
      ],
      prerequisites: ["YAML", "load balancing", "container images"],
      analogy:
        "Think of Kubernetes like an autopilot: you set the destination and constraints, then controllers keep correcting the system as conditions change.",
      question: "What does a Kubernetes controller keep trying to reconcile?",
      expectedAnswer: "It reconciles the desired state declared by the user with the actual state running in the cluster."
    },
    expert: {
      summaryAddendum:
        "At an expert level, Kubernetes is an extensible distributed control plane. The API server exposes state, etcd stores it, controllers reconcile resources, and node agents implement work through CRI, CNI, and CSI integrations. The deeper questions are consistency, admission control, scheduling policy, blast radius, upgrade safety, and how custom resources extend the platform without destabilizing it.",
      keyTerms: [
        term("API server", "The central Kubernetes interface for reads, writes, and admission.", "hard"),
        term("etcd", "The strongly consistent backing store for cluster state.", "hard"),
        term("admission control", "Policy hooks that validate or mutate API requests.", "hard"),
        term("CRI CNI CSI", "The runtime, networking, and storage integration boundaries.", "hard")
      ],
      prerequisites: ["distributed systems", "network policy", "control planes"],
      analogy:
        "Think of Kubernetes as a programmable operating system for clusters: the API is the syscall surface and controllers are long-running system daemons.",
      question: "Why is Kubernetes often described as a control plane rather than just a scheduler?",
      expectedAnswer:
        "Because scheduling is only one controller-driven behavior inside a larger API-backed reconciliation system."
    }
  },
  "Neural networks": {
    intermediate: {
      summaryAddendum:
        "At an intermediate level, focus on the training loop: forward pass, loss calculation, backpropagation, and an optimizer updating parameters. The model's success depends not only on architecture, but also on data quality, feature representation, regularization, learning rate, and whether it generalizes beyond the training examples.",
      keyTerms: [
        term("forward pass", "The prediction step before measuring error.", "medium"),
        term("optimizer", "The algorithm that updates weights using gradients.", "medium"),
        term("generalization", "Whether the model works on examples it did not train on.", "medium"),
        term("regularization", "Techniques that reduce overfitting.", "medium")
      ],
      prerequisites: ["vectors", "gradients", "datasets"],
      analogy:
        "Think of training like tuning a recipe through repeated taste tests: each batch gives feedback, but the recipe must work for future meals too.",
      question: "What is the purpose of the optimizer in training?",
      expectedAnswer: "It uses gradient information to adjust model weights so future predictions reduce the loss."
    },
    expert: {
      summaryAddendum:
        "At an expert level, the interesting layer is the interaction between architecture, objective, optimization dynamics, and data distribution. Capacity, inductive bias, normalization, initialization, regularization, and compute budget all shape what representations the network learns and how brittle those representations are under distribution shift.",
      keyTerms: [
        term("inductive bias", "The assumptions an architecture makes easier to learn.", "hard"),
        term("optimization dynamics", "How training behavior evolves over many updates.", "hard"),
        term("distribution shift", "When production data differs from training data.", "hard"),
        term("representation learning", "How internal layers encode useful structure.", "hard")
      ],
      prerequisites: ["linear algebra", "optimization", "probability"],
      analogy:
        "Think of the network as a learned coordinate system: training shapes which directions in that space become useful for the task.",
      question: "Why can a model with low training loss still fail in production?",
      expectedAnswer:
        "It may have overfit the training distribution or learned representations that do not transfer under distribution shift."
    }
  },
  OAuth: {
    intermediate: {
      summaryAddendum:
        "At an intermediate level, OAuth is easiest to understand through the authorization code flow. The client sends the user to an authorization server, receives a short-lived code at a registered redirect URI, exchanges that code for tokens, and uses scopes to limit API access. The core design goal is delegated authorization with limited exposure.",
      keyTerms: [
        term("authorization code flow", "The common browser-based OAuth flow for server-side apps.", "medium"),
        term("token exchange", "The step where a temporary code becomes usable tokens.", "medium"),
        term("refresh token", "A token used to obtain new access tokens.", "medium"),
        term("resource server", "The API that accepts and validates the access token.", "medium")
      ],
      prerequisites: ["HTTP redirects", "API requests", "tokens"],
      analogy:
        "Think of OAuth like checking into a hotel: the front desk verifies you and gives a key card with only the access you need.",
      question: "Why does the authorization code flow use a temporary code first?",
      expectedAnswer:
        "It lets the client complete a controlled server-side token exchange instead of exposing long-lived credentials in the browser redirect."
    },
    expert: {
      summaryAddendum:
        "At an expert level, OAuth is a protocol framework with security properties that depend on exact flow choices and implementation details. PKCE, redirect URI validation, token audience, issuer checks, scope design, refresh-token rotation, sender-constrained tokens, and replay resistance determine whether delegated access stays bounded in real systems.",
      keyTerms: [
        term("PKCE", "A protection for authorization code interception.", "hard"),
        term("token audience", "The intended API or service for a token.", "hard"),
        term("issuer validation", "Checking which authority minted a token.", "hard"),
        term("refresh-token rotation", "Reducing damage if a refresh token leaks.", "hard")
      ],
      prerequisites: ["threat modeling", "browser security", "JWT validation"],
      analogy:
        "Think of OAuth as a delegated capability system: every token is a scoped capability whose issuer, audience, lifetime, and holder matter.",
      question: "What makes OAuth security depend on implementation details?",
      expectedAnswer:
        "Small choices around redirects, token validation, PKCE, scope boundaries, and token storage determine whether the delegated access can be abused."
    }
  },
  "Oracle Acceleron": {
    intermediate: {
      summaryAddendum:
        "At an intermediate level, focus on the data path. Acceleron moves cloud-managed packet handling, virtual device presentation, storage translation, and security policy closer to the SmartNIC. That can reduce host CPU overhead and latency while still exposing familiar guest interfaces like accelerated VirtIO networking and NVMe-style storage.",
      keyTerms: [
        term("data path", "The route packets or storage operations take through the platform.", "medium"),
        term("off-box virtualization", "Moving virtualization work away from the customer host CPU.", "medium"),
        term("PCIe", "The high-speed local bus used for devices such as SmartNICs and NVMe.", "medium"),
        term("policy enforcement", "Where cloud infrastructure applies traffic and access rules.", "medium")
      ],
      prerequisites: ["virtualization", "PCIe devices", "network throughput"],
      analogy:
        "Think of Acceleron as a specialized traffic desk at the edge of the server that handles routing, checks, and device translation before the workload spends CPU on it.",
      question: "Why does moving data-path work to the SmartNIC matter?",
      expectedAnswer:
        "It can reduce host overhead and latency while preserving cloud-managed networking, storage, and security controls."
    },
    expert: {
      summaryAddendum:
        "At an expert level, Acceleron is about collapsing infrastructure control and high-performance I/O into a programmable device boundary. The interesting questions are how VirtIO and NVMe front ends map to OCI-managed backends, where tenant isolation is enforced, how policy is applied in the packet path, and what failure domains appear when SmartNIC firmware, host software, and cloud control planes interact.",
      keyTerms: [
        term("device boundary", "Where guest-visible devices meet provider-controlled infrastructure.", "hard"),
        term("tenant isolation", "The separation guarantees between workloads and customers.", "hard"),
        term("firmware control plane", "The SmartNIC-managed layer that must stay coordinated with OCI services.", "hard"),
        term("I/O virtualization", "How network and storage devices are presented to instances.", "hard")
      ],
      prerequisites: ["I/O virtualization", "NIC offload", "cloud isolation"],
      analogy:
        "Think of Acceleron as a provider-controlled I/O coprocessor: it presents standard device surfaces while keeping enforcement and acceleration outside the guest.",
      question: "What is the key architectural boundary Acceleron changes?",
      expectedAnswer:
        "It moves more cloud networking, storage, and enforcement work into a provider-controlled SmartNIC boundary while preserving standard guest-facing device interfaces."
    }
  }
};

export function getSeededExplanation(input: ExplainInput): ExplainOutput {
  const seeded = findSeededConcept(input.user_goal);

  if (seeded) {
    return withRequestedLevel(seeded.explanation, input.learner_level);
  }

  return createGenericExplanation(input.user_goal, input.learner_level);
}

export function getSeededDrilldown(input: DrilldownInput): DrilldownOutput {
  const seeded = findSeededConcept(input.root_concept);
  const lookupKey = key(input.parent_concept, input.selected_text);
  const output = seeded?.drilldowns[lookupKey];

  if (output) {
    return withRequestedDrilldownLevel(output, input);
  }

  return createGenericDrilldown(input);
}

function findSeededConcept(goal: string) {
  const normalizedGoal = normalizeTerm(goal);

  return seededConcepts.find((concept) =>
    concept.aliases.some((alias) => {
      const normalizedAlias = normalizeTerm(alias);
      return normalizedGoal === normalizedAlias || normalizedGoal.includes(normalizedAlias);
    })
  );
}

function withRequestedLevel(output: ExplainOutput, learnerLevel: LearnerLevel): ExplainOutput {
  const variant = levelCopyByConcept[output.concept]?.[learnerLevel];

  if (!variant) {
    return {
      ...output,
      level: learnerLevel
    };
  }

  return {
    ...output,
    level: learnerLevel,
    summary: `${variant.summaryAddendum} ${output.summary}`,
    key_terms: compactTerms([...variant.keyTerms, ...output.key_terms], 8),
    prerequisites: uniqueStrings([...output.prerequisites, ...variant.prerequisites]).slice(0, 7),
    analogy: variant.analogy,
    check_understanding: [
      {
        question: variant.question,
        expected_answer: variant.expectedAnswer
      }
    ]
  };
}

function withRequestedDrilldownLevel(output: DrilldownOutput, input: DrilldownInput): DrilldownOutput {
  if (input.learner_level === "beginner") {
    return output;
  }

  const lens =
    input.learner_level === "expert"
      ? {
          explanation:
            ` Expert lens: pay attention to the boundary conditions around ${output.term}, including ownership, failure modes, security assumptions, and where control passes between components.`,
          why:
            ` For ${input.parent_concept}, this term is also a design boundary: it affects performance, isolation, and operational risk, not just the happy-path explanation.`,
          terms: ["boundary condition", "control point", "failure mode", "security assumption"],
          example:
            `In a real architecture review, you would ask who owns ${output.term.toLowerCase()}, what telemetry proves it is healthy, and how the system behaves when it degrades.`
        }
      : {
          explanation:
            ` At an intermediate level, connect ${output.term.toLowerCase()} to the mechanism: where it sits in ${input.parent_concept}, what it passes to the next piece, and what tradeoff it introduces.`,
          why:
            ` For ${input.parent_concept}, this helps move from definition to system behavior: inputs, outputs, constraints, and tradeoffs.`,
          terms: ["mechanism", "tradeoff", "constraint", "failure mode"],
          example:
            `A practical way to test your understanding is to trace one request or operation through ${output.term.toLowerCase()} and name what changes before and after it.`
        };

  return {
    ...output,
    contextual_explanation: `${output.contextual_explanation}${lens.explanation}`,
    why_it_matters_here: `${output.why_it_matters_here}${lens.why}`,
    new_terms: uniqueStrings([...lens.terms, ...output.new_terms]).slice(0, 6),
    simple_example: lens.example
  };
}

function createGenericExplanation(userGoal: string, learnerLevel: LearnerLevel): ExplainOutput {
  const concept = userGoal.trim() || "the concept";
  const lowerConcept = concept.toLowerCase();
  const levelCopy =
    learnerLevel === "expert"
      ? {
          summary:
            `At an expert level, evaluate ${concept} by its architecture, boundary conditions, failure modes, and tradeoffs. Start with the purpose, then map the components, assumptions, performance constraints, and risks that shape whether the idea works in a real system.`,
          terms: [
            term("architecture", `The structural design behind ${concept}.`, "hard"),
            term("boundary conditions", `Where ${concept} stops working cleanly.`, "hard"),
            term("failure modes", `How ${concept} can break or degrade.`, "hard"),
            term("tradeoffs", `The costs and compromises that shape ${concept}.`, "medium")
          ],
          analogy:
            "Think of it like reviewing a production design: the interesting part is not just what it does, but what assumptions make it hold.",
          expected:
            "A strong answer should name the architecture, assumptions, tradeoffs, and likely failure modes."
        }
      : learnerLevel === "intermediate"
        ? {
            summary:
              `At an intermediate level, understand ${concept} by tracing the mechanism. Identify the main parts, what each part receives, what it produces, and what tradeoff appears when those parts interact. This turns ${lowerConcept} from a definition into a working mental model.`,
            terms: [
              term("mechanism", `How ${concept} actually works step by step.`, "medium"),
              term("main parts", `The pieces that make ${concept} easier to reason about.`, "easy"),
              term("tradeoffs", `The costs and compromises that shape ${concept}.`, "medium"),
              term("real example", `A concrete way to connect ${concept} to practice.`, "easy")
            ],
            analogy:
              "Think of it like following a package through a delivery system: each handoff explains how the whole thing works.",
            expected:
              "A good answer should trace the main parts and explain what each part changes."
          }
        : {
            summary:
              `${concept} is best understood by separating the core idea from the details around it. Start with what problem ${lowerConcept} is meant to solve, then identify the main parts involved, the tradeoffs those parts create, and one real example where the idea shows up. This keeps the learning path grounded: instead of memorizing definitions, you can connect each new term back to why it matters for understanding ${lowerConcept}.`,
            terms: [
              term("core idea", `The central purpose behind ${concept}.`, "easy"),
              term("main parts", `The pieces that make ${concept} easier to reason about.`, "easy"),
              term("tradeoffs", `The costs and compromises that shape ${concept}.`, "medium"),
              term("real example", `A concrete way to connect ${concept} to practice.`, "easy")
            ],
            analogy:
              "Think of it like learning a new neighborhood: first find the main streets, then explore the side streets only when they help you get oriented.",
            expected:
              "A good answer should name the practical problem before naming the tools or details."
          };
  const keyTerms = compactTerms([
    ...levelCopy.terms
  ]);

  return {
    concept,
    level: learnerLevel,
    summary: levelCopy.summary,
    key_terms: keyTerms,
    prerequisites: ["problem", "system", "example"],
    analogy: levelCopy.analogy,
    check_understanding: [
      {
        question: `What problem does ${concept} help solve?`,
        expected_answer: levelCopy.expected
      }
    ],
    safety_note: null
  };
}

function createGenericDrilldown(input: DrilldownInput): DrilldownOutput {
  const termText = input.selected_text.trim();
  const parent = input.parent_concept.trim();
  const levelDetail =
    input.learner_level === "expert"
      ? ` For an expert learner, examine assumptions, ownership boundaries, failure modes, and whether this term changes performance, safety, or correctness in ${parent}.`
      : input.learner_level === "intermediate"
        ? ` For an intermediate learner, trace where it sits in the mechanism: what it receives, what it changes, and what tradeoff it creates for ${parent}.`
        : "";

  return {
    term: termText,
    parent_concept: parent,
    contextual_explanation:
      `${termText} matters here because it is one of the ideas that supports ${parent}. In this context, you do not need a full encyclopedia definition yet. Focus on how ${termText.toLowerCase()} changes what ${parent.toLowerCase()} can do, what problem it helps solve, and what new decision it introduces. Once that relationship is clear, the parent concept becomes easier to hold in your head.${levelDetail}`,
    why_it_matters_here:
      `Understanding ${termText.toLowerCase()} helps explain a specific part of ${parent}, instead of becoming a separate research detour.`,
    new_terms: ["purpose", "mechanism", "example"],
    depth_warning: input.breadcrumb_path.length >= 4,
    simple_example:
      `If ${parent} is the larger topic, ${termText.toLowerCase()} is one piece you would point to when explaining how the larger idea works in practice.`,
    safety_note: null
  };
}

function uniqueStrings(values: string[]) {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    const normalized = normalizeTerm(trimmed);

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    unique.push(trimmed);
  }

  return unique;
}
