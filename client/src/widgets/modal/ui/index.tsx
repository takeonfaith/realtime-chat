import React, { useMemo, useRef } from "react";

import useCoreModal from "../lib/hooks/use-core-modal";
import ModalContent from "./atoms/modal-content";
import ModalWrapper from "./atoms/modal-wrapper";

import { FiChevronLeft } from "react-icons/fi";
import useOnClickOutside from "../../../shared/lib/hooks/use-on-click-outside";
import { Button } from "../../../shared/ui/atoms";
import { Colors } from "../../../shared/consts";

const Modal = () => {
  const { isOpen, component: Component, canBack, back, close } = useCoreModal();
  const ref = useRef(null);
  const isValid = useMemo(() => isOpen && !!Component, [isOpen, Component]);

  useOnClickOutside(ref, () => {
    close();
  });

  return (
    <ModalWrapper isOpen={isValid}>
      <ModalContent isOpen={isValid} ref={ref}>
        {canBack && (
          <Button
            onClick={back}
            icon={<FiChevronLeft />}
            text="Назад"
            background="transparent"
            textColor={Colors.blue.main}
          />
        )}
        <>{Component}</>
      </ModalContent>
    </ModalWrapper>
  );
};

export default React.memo(Modal);
