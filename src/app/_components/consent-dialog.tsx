"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

export default function ConsentDialog() {
  const [open, setOpen] = useState(true);

  const handleAgree = () => {
    localStorage.setItem("hasConsent", "true");
    setOpen(false);
  };
  const handleDisagree = () => { window.location.href = "/done"; };

  return (
    <Dialog.Root open={open} onOpenChange={() => {}}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,700px)]">
          <Dialog.Content
            className="rounded-lg bg-white p-6 shadow-lg max-h-[95vh] flex flex-col"
            onEscapeKeyDown={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <Dialog.Title className="text-xl font-semibold text-center">
              We need your consent
            </Dialog.Title>
            <p className="mt-2 text-lg font-semibold">
              Research Project - Privacy in AR
            </p>

            <div className="mt-4 space-y-3 text-sm text-gray-700 overflow-y-auto pr-2">
              <p><strong>Principal Investigators</strong></p>
              <div className="space-y-1">
                <p>Name: Frederik Ødgaard Hammer</p>
                <p>Affiliation: Aalborg University</p>
                <p>Email: fhamme21@student.aau.dk</p>
              </div>

              <div className="mt-3 space-y-1">
                <p>Name: Rasmus Rytter Sørensen</p>
                <p>Affiliation: Aalborg University</p>
                <p>Email: rasmus21@student.aau.dk</p>
              </div>

              <p><strong>Research Purpose</strong></p>
              <p>
                We invite you to participate in a survey study. Before you decide to participate, please ensure you understand the purpose and details of this study. Carefully read the information below, and if you have any unclear points or need more information, please ask the researchers. The purpose of this study is to evaluate people's potential concerns or discomforts towards everyday AR systems and whether censoring methods are effective in mitigating this.
              </p>

              <p><strong>Research Risks</strong></p>
              <p>
                There are no known risks associated with completing this survey. If you wish, you can terminate your survey submission at any time.
              </p>

              <p><strong>Confidentiality of the Survey</strong></p>
              <p>
                No personally identifiable data is collected and will be used solely for research purposes.
              </p>

              <p><strong>Contact Information</strong></p>
              <p>
                If you have any questions about this study or encounter adverse effects from participating in this study, you can contact the researchers. If you have questions about your rights as a research participant, please contact cs-26-sd-10-05@student.aau.dk.
              </p>

              <p><strong>Voluntary Participation</strong></p>
              <p>
                Whether or not you participate in this study is up to you. If you decide to participate in this study, you will be asked to sign an informed consent form. After signing the consent form, you can still withdraw at any time without reason, and withdrawing from this study will not affect your relationship with the researchers.
              </p>

              <p><strong>Informed Consent Form</strong></p>
              <p>
                I have read and understood the provided information and have had the opportunity to ask questions. I voluntarily participate in the survey and can withdraw at any time without reason.
              </p>
              <p>
                If you agree and acknowledge the above content, please click the "Agree" button below to start answering the questions. If you do not agree or acknowledge the above content, please click the "Disagree" button below to discontinue participation in this survey project.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700"
                onClick={handleDisagree}
              >
                Disagree and Exit
              </button>
              <button
                className="rounded-md bg-blue-600 px-4 py-2 text-white"
                onClick={handleAgree}
              >
                Agree and Continue
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}